"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateToken = (userid) => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userid: userid }, process.env.PRIVATE_TOKEN, { expiresIn: '1h' });
    return token;
};
exports.default = generateToken;
