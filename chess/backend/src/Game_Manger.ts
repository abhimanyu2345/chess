import { WebSocket } from "ws";
import { Game } from "./Game";
import { CHAT, INIT, MOVE } from "./Constants/Constants";
import pool from "./DB/db";
import tokenAuth from "./token_components/tokenAuth";

pool.query('SELECT * FROM users')
  .then((res):any=> console.log(res.rows))
  .catch((err):any => console.error('Error executing query:', err));

export class Game_Manager{
    private games:Game[];
    private waiting_players:{'websocket':WebSocket,'playerId':string}|null;
    private userList:WebSocket[];
    constructor(){
        this.games =[];
        this.userList=[];
        this.waiting_players=null;
    }










    public addUser(user:WebSocket){
        this.userList.push(user);
        this.handleUserAdd(user);
        
    }
    public removeUser(user: WebSocket) {
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
        } else {
            console.log("User not found in the list.");
        }
    }
    private   handleUserAdd(user: WebSocket) {
        user.on('message',  (data) => {
            let message;
            try {
                message = JSON.parse(data.toString());
            } catch (error) {
                console.error('Invalid message format:', error);
                return;
            }
    
            console.log('Received message:', message);
    
            switch (message.type) {
                case INIT: {
                    const isValid = message?.playerId &&  tokenAuth(message.token).response;

                    if (!isValid) {
                        console.log('Invalid player ID');
                        
                        break;
                    }
    
                    if (!this.waiting_players) {
                        console.log('Adding waiting player:', message.playerId);
                        this.waiting_players = { websocket: user, playerId: message.playerId };
                    } else if (message.playerId !== this.waiting_players.playerId) {
                        console.log('Matching players:', message.playerId, this.waiting_players.playerId);
                        const newGame = new Game(
                            this.waiting_players.websocket,
                            user,
                            this.waiting_players.playerId,
                            message.playerId,
                            
                        );
                        this.games.push(newGame);
                        this.waiting_players = null;
                    } else {
                        console.log('Request from the same player. Ignored.');
                    }
                    break;
                }
    
                case MOVE: {
                    this.games.forEach((game) => {
                        if (user === game.player1 || user === game.player2) {
                            game.makeMove(user, message.move, message.playerId);
                        }
                    });
                    break;
                }
    
                case CHAT: {
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