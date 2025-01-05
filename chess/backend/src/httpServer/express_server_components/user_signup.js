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
const db_1 = __importDefault(require("../../DB/db"));
const passwordHasher_1 = __importDefault(require("./passwordHasher"));
const token_generation_1 = __importDefault(require("../../token_components/token_generation"));
const insertData = (username, password, email, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received signup data:", { username, email, password });
        const hashedPassword = yield (0, passwordHasher_1.default)(password);
        console.log("Password hashed successfully");
        const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING user_id, username, email, password_hash, created_at;
    `;
        console.log("Executing query:", query);
        const result = yield db_1.default.query(query, [username, email, hashedPassword]);
        if (!result.rows.length) {
            console.error("User insertion failed: No rows returned.");
            return res.status(500).json({ message: "User insertion failed" });
        }
        const token = (0, token_generation_1.default)({ Id: result.rows[0].user_id,
            username: result.rows[0].username,
            email: result.rows[0].email, });
        console.log("User inserted successfully:");
        res.cookie("authToken", token, {
            httpOnly: true, // Cookie cannot be accessed via JavaScript
            secure: true, // Use false in dev for non-HTTPS environments
            sameSite: "None", // Allows cross-origin cookies
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        return res.status(200).json("Signup successful");
    }
    catch (err) {
        console.error(`Error inserting user: ${err.stack}`);
        return res.status(400).json({ message: `Error inserting user: ${err.message}` });
    }
});
exports.default = insertData;
