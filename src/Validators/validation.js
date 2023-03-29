const mongoose = require("mongoose")

const isValidBody = function (data) {
    return Object.keys(data).length > 0;
};

const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
}

const isValid = function (value) {
    if (typeof value !== "string") return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};

const validImage = function (image) {
    return /(\.jpg|\.jpeg|\.bmp|\.gif|\.PNG|\.png)$/.test(image)
}

let isValidPassword = function (password) {
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return passwordRegex.test(password)
}

module.exports = { isValid, isValidBody, isValidObjectId, validImage, isValidPassword }