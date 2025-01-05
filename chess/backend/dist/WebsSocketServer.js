"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const Game_Manger_1 = require("./Game_Manger");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const member = new Game_Manger_1.Game_Manager();
const startWebSocket = () => {
    wss.on('connection', (ws) => {
        console.log('connection');
        member.addUser(ws);
        ws.on('close', () => {
            member.removeUser(ws);
        });
    });
};
exports.default = startWebSocket;
