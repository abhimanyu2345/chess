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
exports.Game = void 0;
const Constants_1 = require("./Constants/Constants");
const chess_js_1 = require("chess.js");
const db_1 = require("./DB/db"); // Assuming you're using PostgreSQL with `pg` library
class Game {
    constructor(websocket, websocket2, playerId1, playerId2) {
        this.time = new Date();
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.player1 = websocket;
        this.playerId1 = playerId1;
        this.playerId2 = playerId2;
        this.player2 = websocket2;
        this.gameId = null;
        console.log("Game created");
        // Create a new game in the database
        this.createGameInDB();
        // Send initial color assignments to players
        this.player1.send(JSON.stringify({ "type": "color", "message": "w" }));
        this.player2.send(JSON.stringify({ "type": "color", "message": "b" }));
    }
    createGameInDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO games (white_player_id, black_player_id, result)
                VALUES ($1, $2, 'in_progress')
                RETURNING game_id
            `;
                const values = [this.playerId1, this.playerId2];
                const result = yield db_1.pool.query(query, values);
                this.gameId = result.rows[0].game_id;
                console.log("Game stored in DB with ID:", this.gameId);
            }
            catch (error) {
                console.error("Error creating game in DB:", error);
            }
        });
    }
    makeMove(player, move, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPlayer1 = this.moves.length % 2 === 0;
            const isPlayer2 = this.moves.length % 2 === 1;
            if ((isPlayer1 && player === this.player1) || (isPlayer2 && player === this.player2)) {
                try {
                    const moveResult = this.board.move(move);
                    if (!moveResult) {
                        throw new Error("Invalid move");
                    }
                    yield this.storeMoveInDB(move, playerId);
                    const otherPlayer = isPlayer1 ? this.player2 : this.player1;
                    otherPlayer.send(JSON.stringify({
                        "type": Constants_1.MOVE,
                        "playerId": playerId,
                        "move": move
                    }));
                    if (!this.board.isGameOver()) {
                        this.moves.push(move);
                    }
                    else {
                        yield this.notifyGameOver();
                    }
                }
                catch (error) {
                    console.error("Error making move:", error);
                    player.send(JSON.stringify({ "type": "error", "message": "Invalid move!" }));
                }
            }
            else {
                player.send(JSON.stringify({ "type": "error", "message": "It's not your turn!" }));
            }
        });
    }
    handleLeave(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const LivePlayer = user === this.player1 ? this.player2 : this.player1;
            LivePlayer.send(JSON.stringify({
                type: Constants_1.ABANDONED,
                message: "One of the players left the game",
            }));
            user.send(JSON.stringify({
                type: Constants_1.ABANDONED,
                message: "You have left the game",
            }));
            yield this.removeGameInDB();
        });
    }
    handleMessage(message, userId) {
        const Receiver = (userId === this.playerId1) ? this.player2 : this.player1;
        const ReceiverId = (userId === this.playerId1) ? this.playerId2 : this.playerId1;
        try {
            console.log(JSON.stringify({ type: 'chat', ChatContent: message, playerId: ReceiverId }));
            Receiver.send(JSON.stringify({ type: 'chat', ChatContent: message, playerId: ReceiverId }));
        }
        catch (e) {
            console.error(e);
        }
    }
    storeMoveInDB(move, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.gameId) {
                console.error("Game ID is null, cannot store move in database");
                return;
            }
            try {
                const query = `
                INSERT INTO moves (game_id, player_id, move, move_number)
                VALUES ($1, $2, $3, $4)
            `;
                const values = [this.gameId, playerId, JSON.stringify(move), this.moves.length + 1];
                yield db_1.pool.query(query, values);
                console.log("Move stored in DB");
            }
            catch (error) {
                console.error("Error storing move in DB:", error);
            }
        });
    }
    notifyGameOver() {
        return __awaiter(this, void 0, void 0, function* () {
            const gameStatus = this.board.isDraw() ? "draw" : "completed";
            const winner = this.board.isDraw() ? null : (this.board.turn() === 'w' ? this.playerId2 : this.playerId1);
            if (!this.gameId) {
                console.error("Game ID is null, cannot update game status");
                return;
            }
            try {
                const query = `
                UPDATE games
                SET result = $1, end_time = CURRENT_TIMESTAMP, winner_id = $2
                WHERE game_id = $3
            `;
                const values = [gameStatus, winner, this.gameId];
                yield db_1.pool.query(query, values);
                this.player1.send(JSON.stringify({ type: "gameOver", status: gameStatus }));
                this.player2.send(JSON.stringify({ type: "gameOver", status: gameStatus }));
                console.log("Game over. Status updated in database.");
            }
            catch (error) {
                console.error("Error notifying game over:", error);
            }
        });
    }
    removeGameInDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const gameStatus = 'player_exit';
            if (!this.gameId) {
                console.error("Game ID is null, cannot remove game from database");
                return;
            }
            try {
                const query = `
                UPDATE games
                SET result = $1, end_time = CURRENT_TIMESTAMP
                WHERE game_id = $2
            `;
                const values = [gameStatus, this.gameId];
                yield db_1.pool.query(query, values);
                console.log("Game status updated to 'player_exit' in database");
            }
            catch (error) {
                console.error("Error removing game from database:", error);
            }
        });
    }
}
exports.Game = Game;
