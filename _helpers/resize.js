const sharp = require('sharp');

module.exports = function resize(dataBuffer, format, width, height) {
    return new Promise(function(resolve, reject) {
        let transform = sharp(dataBuffer);
        if (format) {
            transform = transform.toFormat(format)
        }
        if (width || height) {
            transform = transform.resize(width, height)
        }
        resolve(transform.toBuffer());
    });
}