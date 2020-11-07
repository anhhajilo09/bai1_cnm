const AWS = require('aws-sdk');
const bucketName = "holo-quanlysv";
const fs = require('fs');
AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    region: "ap-southeast-1"
})

const s3 = new AWS.S3();

function uploadFile(file) {
    return new Promise(function(resolve, reject) {
        fs.readFile(file.path, function(err, data) {
            if (err) {
                reject(err);
            } else {
                var fileType = file.type.split('/').pop();
                if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {
                    s3.upload({
                        Bucket: bucketName,
                        Key: 'images/' + file.name,
                        Body: data
                    }, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                } else {
                    reject({ statusCode: 400, message: "Không cho phép upload ngoài trừ file hình" })
                }
            }
        });
    });
}

function deleteFile(key) {
    return new Promise(function(resolve, reject) {
        s3.deleteObject({ Bucket: bucketName, Key: 'images/' + key }, function(err, data) {
            if (err) {
                reject(err);
            } else resolve(true);
        });
    });
}

function getFile(key) {
    return new Promise(function(resolve, reject) {
        s3.getObject({ Bucket: bucketName, Key: key }, function(err, data) {
            if (err) {
                reject(err);
            } else resolve(data.Body);
        });
    });
}
module.exports = {
    uploadFile,
    deleteFile,
    getFile
}