"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Constants_1 = require("./Constants");
const chess_js_1 = require("chess.js");
class Game {
    constructor(websocket, websocket2) {
        this.time = new Date();
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.player2 = websocket2;
        this.player1 = websocket;
        console.log("game created");
        this.player1.send(JSON.stringify({ "type": "message", "message": "w" }));
        this.player2.send(JSON.stringify({ "type": "message", "message": "b" }));
    }
    makeMove(player, move) {
        console.log(move);
        if ((this.moves.length % 2 === 0 && player == this.player1) || (this.moves.length % 2 === 1 && player == this.player2)) {
            try {
                this.board.move(move);
            }
            catch (e) {
                console.log(e);
            }
            if (!this.board.isGameOver()) {
                const Other_player = (this.moves.length % 2 === 1) ? this.player1 : this.player2;
                Other_player.send(JSON.stringify({
                    "type": Constants_1.MOVE,
                    "player": "playreID",
                    "move": move
                }));
                this.moves.push(move);
            }
        }
    }
}
exports.Game = Game;
