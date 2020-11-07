const AWS = require('aws-sdk');
const tableName = "students";

AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    region: "ap-southeast-1"
})

const docClient = new AWS.DynamoDB.DocumentClient();

function getAll() {
    return new Promise(function(resolve, reject) {
        docClient.scan({
            TableName: tableName
        }, function(error, data) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                const { Items } = data;
                resolve(Items)
            }
        });
    });
}

function getAllContinue(LastEvaluatedKey) {
    return new Promise(function(resolve, reject) {
        docClient.scan({
            TableName: tableName,
            ExclusiveStartKey: LastEvaluatedKey
        }, function(error, data) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                const { Items } = data;
                resolve(Items)
            }
        });
    });
}

function putSinhVien(sinhvien) {
    return new Promise(function(resolve, reject) {
        docClient.put({
            TableName: tableName,
            Item: sinhvien
        }, function(error, data) {
            if (error)
                reject(error);
            else {
                resolve(true);
            }
        });
    });
}

function deleteSinhVienByID(id) {
    return new Promise(function(resolve, reject) {
        docClient.delete({
            TableName: tableName,
            Key: {
                "id": id
            },
            ReturnValues: "ALL_OLD"
        }, function(error, data) {
            if (error)
                reject(error);
            else {
                const { Attributes } = data;
                resolve(Attributes);
            }
        });
    });
}

function getSinhVienByID(id) {
    return new Promise(function(resolve, reject) {
        docClient.get({
            TableName: tableName,
            Key: {
                "id": id
            }
        }, function(error, data) {
            if (error)
                reject(error);
            else {
                const { Item } = data;
                resolve(Item);
            }
        });
    });
}
module.exports = {
    getAll,
    getSinhVienByID,
    putSinhVien,
    deleteSinhVienByID
}