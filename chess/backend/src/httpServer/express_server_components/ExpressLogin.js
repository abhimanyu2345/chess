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
const db_1 = __importDefault(require("../../DB/db"));
const token_generation_1 = __importDefault(require("../../token_components/token_generation"));
const bcrypt = require('bcrypt');
function Login(username, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT  * FROM users WHERE username=$1`;
        try {
            const response = yield db_1.default.query(query, [username]);
            if (response.rows.length > 0) {
                const validationResult = yield bcrypt.compare(password, response.rows[0].password_hash);
                if (validationResult) {
                    const token = (0, token_generation_1.default)({ Id: response.rows[0].user_id,
                        username: response.rows[0].username,
                        email: response.rows[0].email, });
                    res.cookie("authToken", token, {
                        httpOnly: true, // Cookie cannot be accessed via JavaScript
                        secure: true, // Use false in dev for non-HTTPS environments
                        sameSite: "None", // Allows cross-origin cookies
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                    });
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
