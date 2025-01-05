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
// Load environment variables from .env file
(0, dotenv_1.config)();
// Set up the connection configuration using environment variables
exports.pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
});
// Test the connection when the app starts
const db_Connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield exports.pool.connect();
        const res = yield client.query('SELECT NOW()');
        console.log('Connected to PostgreSQL:', res.rows[0]);
        client.release(); // Release the client back to the pool
    }
    catch (err) {
        console.error('Error connecting to PostgreSQL:', err.stack);
    }
});
exports.db_Connect = db_Connect;
// Call dbconnect once to check the connection, but still export the pool
exports.default = exports.pool;
// Export the pool to use in other files
