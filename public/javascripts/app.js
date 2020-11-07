const api = "http://hanguyen.webiste/api/v1/sinhviens";
const apiImage = "http://hanguyen.webiste"
var listSinhviensBlock = document.querySelector("#list_sinhviens");
start();

function start() {
    openLoader();
    getSinhviens(renderListSinhviens);
    handleCreateEditFormSinhVien();
}

function reloadListSinhVien() {
    openLoader();
    getSinhviens(renderListSinhviens);
}

function showCreateFormSinhVien() {
    renderCreateForm();
    openMyModal();
}

function showEditFormSinhVien(id) {
    openLoader();
    getSinhVienByID(id, function(sinhvien) {
        hideLoader();
        renderEditForm(sinhvien);
        openMyModal();
    });
}

function handleDeleteSinhVien(id) {
    hideConfirmDeleteSinhVien();
    openLoader();

    deleteSinhVien(id, function(message) {
        hideLoader();
        if (message.statusCode != 200)
            showAlertDanger(message.message);
        else {
            showAlertSuccess(message.message);
            var sinhvienitem = document.querySelector(`#item-sinhvien-${id}`);
            if (sinhvienitem) {
                sinhvienitem.remove();
            }
        }
    });
}

function handleCreateEditFormSinhVien() {
    var btnLuu = document.getElementById('btnLuu');
    btnLuu.onclick = function() {
        var message = "";
        var valid = true;
        var id = document.querySelector('input[name="id"]');
        var ma_sinhvien = document.querySelector('input[name="ma_sinhvien"]');
        var ten_sinhvien = document.querySelector('input[name="ten_sinhvien"]');
        var namsinh = document.querySelector('select[name="namsinh"]');
        const files = document.getElementById('file-input');
        const file = files.files[0];
        if (id.value == "" && file == null) {
            message += 'Chưa chọn avatar, ';
            valid = false;
        } else
        if (file != null && file.size > 150000) {
            message += 'Quá giới hạn file hình 150KB, ';
            valid = false;
        }
        if (ma_sinhvien.value == "") {
            message += 'Chưa nhập mã sinh viên, ';
            valid = false;
        }

        if (ten_sinhvien.value == "") {
            message += 'Chưa nhập tên sinh viên, ';
            valid = false;
        }

        if (namsinh.value == "") {
            message += 'Chưa chọn năm sinh, ';
            valid = false;
        }
        if (!valid) {
            document.getElementById('form-message').innerHTML = '<p>' + message + '</p>';
        } else {
            closeMyModal();
            openLoader();
            var formData = new FormData();
            formData.append('ma_sinhvien', ma_sinhvien.value);
            formData.append('ten_sinhvien', ten_sinhvien.value);
            formData.append('namsinh', namsinh.value);
            formData.append('file', file);
            if (btnLuu.textContent == "Tạo") {
                addSinhViens(formData, function(message) {
                    hideLoader();
                    if (message.statusCode != 200)
                        showAlertDanger(message.message);
                    else {
                        showAlertSuccess(message.message);
                        getSinhviens(renderListSinhviens);
                    }
                });
            } else if (btnLuu.textContent == "Lưu") {
                updateSinhVien(id.value, formData, function(message) {
                    hideLoader();
                    if (message.statusCode != 200)
                        showAlertDanger(message.message);
                    else {
                        closeMyModal();
                        showAlertSuccess(message.message);
                        getSinhviens(renderListSinhviens);
                    }
                });
            }
        }
    }
}

function renderListSinhviens(sinhviens) {
    hideLoader();
    var htmls = sinhviens.map(sv => {
        return `
            <tr class="w3-hover-grey" id="item-sinhvien-${sv.id}">
                <td><img width='50px' height="50px" src='${apiImage}/images/?fileName=${sv.avatar}&width=40&height=40' alt='Avatar ${sv.id}'/></td>
                <td>${sv.id}</td>
                <td>${sv.ma_sinhvien}</td>
                <td>${sv.ten_sinhvien}</td>
                <td>${sv.namsinh}</td>
                <td><button class="w3-button w3-blue" onclick="showEditFormSinhVien('${sv.id}')">Sửa</button> <button class="w3-button w3-red" onclick="showConfirmDeleteSinhVien('${sv.id}')" >Xóa</button></td>
            </tr>
        `;
    })
    listSinhviensBlock.innerHTML = htmls.join(' ');
}

function getSinhviens(callback) {

    fetch(api).then(res => {
        if (res.status != 200) {
            showAlertDanger("Load dữ liệu thất bại!");
        } else {
            return res.json();
        }
    }).then(callback);
}


function getSinhVienByID(id, callback) {
    fetch(api + '/' + id).then((res) => {
        if (res.status != 200) {
            showAlertDanger("Load dữ liệu thất bại!");
        } else return res.json();
    }).then(callback)
}

function addSinhViens(data, callback) {
    var options = {
        method: 'POST',
        body: data
    }
    fetch(api, options).then((res) => {
        return res.json();
    }).then(callback)
}

function updateSinhVien(id, data, callback) {
    var options = {
        method: 'PUT',
        body: data
    }
    fetch(api + '/' + id, options).then((res) => {
        return res.json();
    }).then(callback);
}

function deleteSinhVien(id, callback) {
    fetch(api + "/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json;"
        }
    }).then((res) => {
        return res.json();
    }).then(callback)
}


function renderCreateForm() {
    document.getElementById('file-input').value = "";
    document.getElementById('form-message').innerHTML = '';
    var ma_sinhvien = document.querySelector('input[name="ma_sinhvien"]');
    var ten_sinhvien = document.querySelector('input[name="ten_sinhvien"]');
    var namsinh = document.querySelector('select[name="namsinh"]');
    ma_sinhvien.value = "";
    ten_sinhvien.value = "";
    namsinh.value = "";
    malop.value = "";
    var id01Title = document.querySelector('#id01Title');
    var btnLuu = document.querySelector('#btnLuu');
    btnLuu.innerHTML = "Tạo";
    id01Title.innerHTML = "Nhập mới";
}

function renderEditForm(sinhvien) {
    document.getElementById('file-input').value = "";
    document.getElementById('form-message').innerHTML = '';
    var id = document.querySelector('input[name="id"]');
    var ma_sinhvien = document.querySelector('input[name="ma_sinhvien"]');
    var ten_sinhvien = document.querySelector('input[name="ten_sinhvien"]');
    var namsinh = document.querySelector('select[name="namsinh"]');

    id.value = sinhvien.id;
    ma_sinhvien.value = sinhvien.ma_sinhvien;
    ten_sinhvien.value = sinhvien.ten_sinhvien;
    namsinh.value = sinhvien.namsinh;
    malop.value = sinhvien.ma_lop;
    var id01Title = document.querySelector('#id01Title');
    var btnLuu = document.querySelector('#btnLuu');
    btnLuu.innerHTML = "Lưu";
    id01Title.innerHTML = "Chỉnh sửa sinh viên ID: " + sinhvien.id;
}

function openLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function openMyModal() {
    document.getElementById('id01').style.display = 'block';
}

function closeMyModal() {
    document.getElementById('id01').style.display = 'none';
}

function showConfirmDeleteSinhVien(id) {
    document.getElementById('modalDeleteSinhVien').innerHTML = `
    <div class="w3-modal" style="display: block;">
        <div class="w3-modal-content w3-animate-top w3-card-4" style="max-width:25rem">
        <header class="w3-container w3-red"> 
            <span onclick="hideConfirmDeleteSinhVien()" class="w3-button w3-large w3-red w3-display-topright">×</span>
            <h2>Xác nhận xóa</h2>
        </header>
        <div class="w3-container">
            <p>Bạn có chắc chắn xóa sinh viên có ID: ${id}</p>
        </div>
        <footer class="w3-container">
            <p><button id="btnXoa" onclick="handleDeleteSinhVien('${id}')" class="w3-btn w3-blue">Xác nhận</button> <button onclick="hideConfirmDeleteSinhVien()" class="w3-button w3-border w3-white">Hủy</button></p>
        </footer>
        </div>
    </div>`;
}

function hideConfirmDeleteSinhVien() {
    document.getElementById('modalDeleteSinhVien').innerHTML = "";
}

function showAlertSuccess(message) {
    document.getElementById('alert').innerHTML = `
    <div class="w3-panel w3-green w3-display-container">
        <span onclick="this.parentElement.style.display='none'" class="w3-button w3-large w3-display-topright">&times;</span>
        <p>${message}</p>
    </div>`;
}

function showAlertDanger(message) {
    document.getElementById('alert').innerHTML = `
    <div class="w3-panel w3-red w3-display-container">
        <span onclick="this.parentElement.style.display='none'" class="w3-button w3-large w3-display-topright">&times;</span>
        <p>${message}</p>
    </div>`;
}