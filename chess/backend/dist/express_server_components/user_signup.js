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
const db_1 = __importDefault(require("../db"));
const passwordHasher_1 = __importDefault(require("./passwordHasher"));
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
        console.log("User inserted successfully:", result.rows[0]);
        return res.status(200).json({
            message: "Signup successful",
            user: result.rows[0]
        });
    }
    catch (err) {
        console.error(`Error inserting user: ${err.stack}`);
        return res.status(400).json({ message: `Error inserting user: ${err.message}` });
    }
});
exports.default = insertData;
