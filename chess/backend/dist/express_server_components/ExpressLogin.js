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
exports.default = Login;
const db_js_1 = __importDefault(require("../db.js"));
const bcrypt = require('bcrypt');
function Login(username, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT password_hash FROM users WHERE username=$1`;
        try {
            const response = yield db_js_1.default.query(query, [username]);
            if (response.rows.length > 0) {
                const validationResult = yield bcrypt.compare(password, response.rows[0].password_hash);
                if (validationResult) {
                    return res.status(200).send("Validation successful");
                }
                else {
                    return res.status(401).send("Invalid password");
                }
            }
            else {
                return res.status(401).send("User not found");
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).send("Internal server error");
        }
    });
}
;
