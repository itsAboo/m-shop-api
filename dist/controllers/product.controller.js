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
exports.getProductByNewest = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const dbConnect_1 = __importDefault(require("../util/dbConnect"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, imageUrl, price, type, category, subCategory, colors, } = req.body;
    let query = `INSERT INTO product (name,description,imageUrl,price,colors,type,category,subCategory)
      VALUES(?,?,?,?,?,?,?,?)`;
    let value = [
        name,
        description,
        imageUrl,
        price,
        colors,
        type,
        category,
        subCategory,
    ];
    if (!name || !price)
        return res.status(404).json({ msg: "Invalid value" });
    if (!colors) {
        query = `INSERT INTO product (name,description,imageUrl,price,type,category,subCategory)
      VALUES(?,?,?,?,?,?,?)`;
        value.splice(4, 1);
    }
    try {
        yield dbConnect_1.default.execute(query, value);
        res.status(200).json({ msg: " Add product success" });
    }
    catch (error) {
        return res.status(500).json({ msg: "Bad request" });
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqQuery = req.query;
    try {
        const allowProperties = [
            "sort",
            "colors",
            "category",
            "min",
            "max",
            "keyword",
        ];
        const unexpectedProperties = Object.keys(reqQuery).filter((prop) => !allowProperties.includes(prop));
        if (unexpectedProperties.length > 0) {
            return res.status(404).json({ msg: "Not found" });
        }
        let result;
        let sql = "SELECT * FROM product";
        if (reqQuery.sort) {
            if (reqQuery.sort === "asc" || reqQuery.sort === "desc") {
                sql += ` ORDER BY price ${reqQuery.sort || "asc"}`;
            }
            else if (reqQuery.sort === "newest") {
                sql += ` ORDER BY createdAt DESC`;
            }
        }
        result = yield dbConnect_1.default.execute(sql);
        if (reqQuery.keyword) {
            result[0] = result[0].filter((val) => {
                var _a, _b, _c;
                return ((_a = val.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(reqQuery.keyword.toLowerCase())) ||
                    ((_b = val.category) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(reqQuery.keyword.toLowerCase())) ||
                    ((_c = val.type) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(reqQuery.keyword.toLowerCase()));
            });
        }
        if (reqQuery.colors) {
            const colorArr = reqQuery.colors.split(",");
            result[0] = result[0].filter((val) => colorArr.every((color) => { var _a; return (_a = val.colors) === null || _a === void 0 ? void 0 : _a.includes(color); }));
        }
        if (reqQuery.category) {
            const categoryArr = reqQuery.category.split(",");
            result[0] = result[0].filter((val) => categoryArr.some((e) => { var _a; return (_a = val.category) === null || _a === void 0 ? void 0 : _a.includes(e); }));
        }
        if (reqQuery.min && reqQuery.max) {
            result[0] = result[0].filter((val) => {
                return (val.price >= Number(reqQuery.min) &&
                    val.price <= Number(reqQuery.max));
            });
        }
        return res.status(200).json({ products: result[0] });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.getProducts = getProducts;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return res.status(500).json({ msg: "Invalid value" });
    try {
        const result = yield dbConnect_1.default.execute("SELECT * FROM product WHERE productId = ?", [id]);
        if (result[0].length < 1)
            return res.status(404).json({ msg: "No product found" });
        res.status(200).json({ product: result[0][0] });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.getProduct = getProduct;
const getProductByNewest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit } = req.params;
    try {
        const result = yield dbConnect_1.default.execute("SELECT * FROM product ORDER BY createdAt DESC LIMIT ? ", [limit]);
        res.status(200).json({ products: result[0] });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
});
exports.getProductByNewest = getProductByNewest;
