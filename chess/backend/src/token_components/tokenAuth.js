"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Use 'import' for jwt
const tokenAuth = (token) => {
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_TOKEN);
        // Return a successful response with the decoded token
        return { response: true, result: decoded };
    }
    catch (err) {
        // Return an error response with the error message
        console.error('Token verification failed:', err);
        return { response: false, result: err.message || 'Invalid token' };
    }
};
exports.default = tokenAuth;
