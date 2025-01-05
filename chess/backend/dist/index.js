"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = require("./db.js");
const express_serever_js_1 = __importDefault(require("./express_serever.js"));
const WebsSocketServer_js_1 = __importDefault(require("./WebsSocketServer.js"));
(0, WebsSocketServer_js_1.default)();
(0, express_serever_js_1.default)();
(0, db_js_1.db_Connect)();
