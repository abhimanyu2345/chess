"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("./DB/db.js");
const express_serever_js_1 = __importDefault(require("./httpServer/express_serever.js"));
(0, express_serever_js_1.default)();
(0, db_js_1.db_Connect)();
