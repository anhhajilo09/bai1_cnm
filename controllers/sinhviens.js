const uuid = require('uuid');
var formidable = require('formidable');

const sinhvienService = require('../services/sinhviens');
const s3Service = require('../services/s3');

function getAll(req, res, next) {
    sinhvienService.getAll().then(data => res.json(data)).catch(err => next(err));
}

function addSinhVien(req, res, next) {
    const id = uuid.v4();
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err)
            next(err);
        else {
            const file = files.file;
            if (file == null) {
                next({ statusCode: 400, message: "Chưa chọn hình" })
            } else {
                var fileType = file.type.split('/').pop();
                const fileName = id + '.' + fileType;
                file.name = fileName;
                s3Service.uploadFile(file).then(data => {
                    if (data) {
                        return sinhvienService.putSinhVien({
                            "id": id,
                            "ma_sinhvien": fields.ma_sinhvien,
                            "ten_sinhvien": fields.ten_sinhvien,
                            "namsinh": fields.namsinh,
                            "ma_lop": fields.ma_lop,
                            "avatar": fileName
                        });
                    }
                }).then(data => {
                    if (data) {
                        next({ statusCode: 200, message: "Thêm thành công sinh viên" })
                    }
                }).catch(err => next(err));
            }
        }
    });
}

function updateSinhVienByID(req, res, next) {
    const id = req.params.sinhvienId;
    sinhvienService.getSinhVienByID(id).then(data => {
        if (!data)
            next({ statusCode: 404, message: 'Không tìm thấy sinh viên.' });
        else {
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                if (err)
                    next(err);
                else {
                    const file = files.file;
                    var fileName = data.avatar;
                    if (file != null) {
                        var fileType = file.type.split('/').pop();
                        fileName = id + '.' + fileType;
                        file.name = fileName;
                        s3Service.uploadFile(file).catch(err => next(err));
                    }
                    sinhvienService.putSinhVien({
                        "id": id,
                        "ma_sinhvien": fields.ma_sinhvien,
                        "ten_sinhvien": fields.ten_sinhvien,
                        "namsinh": fields.namsinh,
                        "ma_lop": fields.ma_lop,
                        "avatar": fileName
                    }).then((data) => {
                        next({ statusCode: 200, message: "Sửa thành công sinh viên ID: " + id })
                    }).catch(err => next(err));
                }
            });
        }
    }).catch(err => next(err));
}

function deleteSinhVienByID(req, res, next) {
    const id = req.params.sinhvienId;
    sinhvienService.getSinhVienByID(id).then(data => {
        if (!data)
            next({ statusCode: 404, message: 'Không tìm thấy sinh viên.' });
        else
            return sinhvienService.deleteSinhVienByID(id);
    }).then(data => {
        return s3Service.deleteFile(data.avatar);
    }).then(data => {
        next({ statusCode: 200, message: 'Xóa thành công sinh viên ID: ' + id });
    }).catch(err => next(err));
}

function getSinhVienByID(req, res, next) {
    sinhvienService.getSinhVienByID(req.params.sinhvienId).then(data => {
        if (!data)
            next({ statusCode: 404, message: 'Không tìm thấy sinh viên.' });
        else res.json(data);
    }).catch(err => next(err));
}

module.exports = {
    getAll,
    getSinhVienByID,
    addSinhVien,
    updateSinhVienByID,
    deleteSinhVienByID
}