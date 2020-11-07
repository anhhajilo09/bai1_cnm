const resize = require('../_helpers/resize')
const s3Service = require('../services/s3');
module.exports = {
    getImage(req, res, next) {
        const fileName = req.query.fileName;
        const widthStr = req.query.width | 50;
        const heightStr = req.query.height | 50;
        const format = req.query.format | 'png';
        let width, height;
        if (widthStr) {
            width = parseInt(widthStr);
        }
        if (heightStr) {
            height = parseInt(heightStr);
        }
        s3Service.getFile('images/' + fileName).then(data => {
            resize(data, format, width, height).then(data => {
                res.type(`image/${ format || 'png' }`);
                res.send(data);
            })
        }).catch(err => {
            next(err);
        });
    }
}