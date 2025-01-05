"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateToken = (userid, res) => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userid: userid }, process.env.PRIVATE_TOKEN, { expiresIn: '1h' });
    return res.json({ "token": token });
};
exports.default = generateToken;
