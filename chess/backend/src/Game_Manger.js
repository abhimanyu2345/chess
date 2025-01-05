"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game_Manager = void 0;
const Game_1 = require("./Game");
const Constants_1 = require("./Constants/Constants");
const db_1 = __importDefault(require("./DB/db"));
const tokenAuth_1 = __importDefault(require("./token_components/tokenAuth"));
db_1.default.query('SELECT * FROM users')
    .then((res) => console.log(res.rows))
    .catch((err) => console.error('Error executing query:', err));
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
        const index = this.userList.indexOf(user);
        if (index !== -1) {
            // Remove user from the user list
            this.userList.splice(index, 1);
            console.log(`User removed from list at index ${index}`);
            // Check if the user is part of any games
            this.games = this.games.filter((game) => {
                const isPlayerInGame = user === game.player1 || user === game.player2;
                if (isPlayerInGame) {
                    game.handleLeave(user); // Notify the game about the user's departure
                    console.log("Game removed successfully.");
                }
                // Retain games where the user is not a participant
                return !isPlayerInGame;
            });
        }
        else {
            console.log("User not found in the list.");
        }
    }
    handleUserAdd(user) {
        user.on('message', (data) => {
            let message;
            try {
                message = JSON.parse(data.toString());
            }
            catch (error) {
                console.error('Invalid message format:', error);
                return;
            }
            console.log('Received message:', message);
            switch (message.type) {
                case Constants_1.INIT: {
                    const isValid = (message === null || message === void 0 ? void 0 : message.playerId) && (0, tokenAuth_1.default)(message.token).response;
                    if (!isValid) {
                        console.log('Invalid player ID');
                        break;
                    }
                    if (!this.waiting_players) {
                        console.log('Adding waiting player:', message.playerId);
                        this.waiting_players = { websocket: user, playerId: message.playerId };
                    }
                    else if (message.playerId !== this.waiting_players.playerId) {
                        console.log('Matching players:', message.playerId, this.waiting_players.playerId);
                        const newGame = new Game_1.Game(this.waiting_players.websocket, user, this.waiting_players.playerId, message.playerId);
                        this.games.push(newGame);
                        this.waiting_players = null;
                    }
                    else {
                        console.log('Request from the same player. Ignored.');
                    }
                    break;
                }
                case Constants_1.MOVE: {
                    this.games.forEach((game) => {
                        if (user === game.player1 || user === game.player2) {
                            game.makeMove(user, message.move, message.playerId);
                        }
                    });
                    break;
                }
                case Constants_1.CHAT: {
                    this.games.forEach((game) => {
                        if (user === game.player1 || user === game.player2) {
                            game.handleMessage(message.ChatContent, message.playerId);
                        }
                    });
                    break;
                }
                default:
                    console.log('Unknown message type:', message.type);
            }
        });
    }
}
exports.Game_Manager = Game_Manager;
