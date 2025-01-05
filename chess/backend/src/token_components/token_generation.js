"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateToken = (userdata) => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(userdata, process.env.PRIVATE_TOKEN, { expiresIn: '1d' });
    return token;
};
exports.default = generateToken;
