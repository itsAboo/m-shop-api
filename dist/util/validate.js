"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAtLeastFourCha = exports.isPassword = exports.isEmail = void 0;
const isEmail = (email) => {
    if (typeof email !== "string" ||
        email == null ||
        typeof email == "undefined") {
        return false;
    }
    return email.trim().length >= 6 && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};
exports.isEmail = isEmail;
const isPassword = (password) => {
    if (typeof password !== "string" ||
        password == null ||
        typeof password == "undefined") {
        return false;
    }
    return password.trim().length >= 6 && password.match(/^[a-zA-Z0-9]+$/);
};
exports.isPassword = isPassword;
const isAtLeastFourCha = (cha) => {
    if (!cha) {
        return false;
    }
    return cha.length > 3 && cha.match(/^[a-zA-Z]+$/);
};
exports.isAtLeastFourCha = isAtLeastFourCha;
