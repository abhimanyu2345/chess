"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game_Manager = void 0;
const Game_1 = require("./Game");
const Constants_1 = require("./Constants");
const db_mjs_1 = __importDefault(require("./db.mjs"));
db_mjs_1.default.query('SELECT * FROM users')
    .then(res => console.log(res.rows))
    .catch(err => console.error('Error executing query:', err));
class Game_Manager {
    constructor() {
        this.games = [];
        this.userList = [];
        this.waiting_players = null;
    }
    addUser(user) {
        this.userList.push(user);
        this.handleUserAdd(user);
    }
    removeUser(user) {
    }
    handleUserAdd(user) {
        user.on('message', (data) => {
            const message = JSON.parse(data.toString());
            console.log(message.type);
            switch (message.type) {
                case Constants_1.INIT:
                    if (this.waiting_players == null) {
                        console.log('waiting player');
                        this.waiting_players = user;
                    }
                    else {
                        console.log('waiting play33er');
                        const newGame = new Game_1.Game(this.waiting_players, user);
                        this.games.push(newGame);
                        this.waiting_players = null;
                    }
                    break;
                case Constants_1.MOVE:
                    this.games.forEach((game) => {
                        if (user == game.player1 || user == game.player2) {
                            console.log("waitingss");
                            game.makeMove(user, message.move);
                        }
                    });
            }
        });
    }
}
exports.Game_Manager = Game_Manager;
