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
Object.defineProperty(exports, "__esModule", { value: true });
exports.db_Connect = exports.pool = void 0;
const dotenv_1 = require("dotenv");
const { Pool } = require('pg');
(0, dotenv_1.config)(); // Load .env variables
// Create a new database pool
exports.pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Supabase
});
// Function to test the database connection
const db_Connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield exports.pool.connect();
        const res = yield client.query("SELECT NOW()");
        console.log("✅ Connected to Supabase:", res.rows[0]);
        client.release(); // Release the client back to the pool
    }
    catch (err) {
        console.error("❌ Error connecting to Supabase:", err.message);
    }
});
exports.db_Connect = db_Connect;
// Test connection when the app starts
(0, exports.db_Connect)();
// Export the pool for queries
exports.default = exports.pool;
