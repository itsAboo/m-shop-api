"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = exports.signIn = exports.signUp = void 0;
const dbConnect_1 = __importDefault(require("../util/dbConnect"));
const validate_1 = require("../util/validate");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    if (!(0, validate_1.isAtLeastFourCha)(firstName) || !(0, validate_1.isAtLeastFourCha)(lastName)) {
        return res.status(404).json({ msg: "Invalid value" });
    }
    if (!(0, validate_1.isEmail)(email)) {
        return res.status(404).json({ msg: "Invalid email" });
    }
    if (!(0, validate_1.isPassword)(password)) {
        return res.status(404).json({ msg: "Invalid password" });
    }
    try {
        const haveUser = yield dbConnect_1.default.execute("SELECT * FROM user WHERE email = ?", [email]);
        if (haveUser[0].length > 0)
            return res.status(404).json({ msg: "Email already exists" });
        const hashPassword = yield bcrypt_1.default.hash(password, 12);
        yield dbConnect_1.default.execute("INSERT INTO user (firstName,lastName,email,password) VALUES(?,?,?,?)", [firstName, lastName, email, hashPassword]);
        const user = yield dbConnect_1.default.execute("SELECT * FROM user WHERE email = ?", [email]);
        yield dbConnect_1.default.execute("INSERT INTO cart (userId) VALUES(?)", [
            user[0][0].userId,
        ]);
        const transformUser = Object.assign(Object.assign({}, user[0][0]), { password: undefined });
        const token = jsonwebtoken_1.default.sign(transformUser, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res
            .status(200)
            .json({ msg: "Register success", token, user: transformUser });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!(0, validate_1.isEmail)(email)) {
        return res.status(404).json({ msg: "Invalid email" });
    }
    if (!(0, validate_1.isPassword)(password)) {
        return res.status(404).json({ msg: "Invalid password" });
    }
    try {
        const haveUser = yield dbConnect_1.default.execute("SELECT * FROM user WHERE email = ?", [email]);
        if (haveUser[0].length < 1)
            return res.status(401).json({ msg: "Incorrect email or password" });
        const pwIsMatch = yield bcrypt_1.default.compare(password, haveUser[0][0].password);
        if (!pwIsMatch)
            return res.status(401).json({ msg: "Incorrect email or password" });
        const transformUser = Object.assign(Object.assign({}, haveUser[0][0]), { password: undefined });
        const token = jsonwebtoken_1.default.sign(transformUser, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ msg: "Login success", token, user: transformUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.signIn = signIn;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield dbConnect_1.default.execute("SELECT * FROM user WHERE userId = ?", [req.userId]);
        if (rows.length < 1)
            return res.status(401).json({ msg: "Can't find this user" });
        const transformUser = Object.assign(Object.assign({}, rows[0]), { password: undefined });
        res.status(200).json({ user: transformUser });
    }
    catch (error) {
        return res.status(200).json({ user: null });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, address, phoneNumber } = req.body;
    try {
        yield dbConnect_1.default.execute("UPDATE user SET firstName = ?,lastName = ?,address = ?,phoneNumber = ? WHERE userId = ?", [firstName, lastName, address, phoneNumber, req.userId]);
        res.status(200).json({ msg: "Update success" });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.updateUser = updateUser;
