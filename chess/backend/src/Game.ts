import { WebSocket } from "ws";
import { ABANDONED, move, MOVE } from "./Constants/Constants";
import { Chess } from "chess.js";
import { pool } from "./DB/db"; // Assuming you're using PostgreSQL with `pg` library
import { v4 as uuidv4 } from "uuid"; // To generate UUIDs for players

type GAME_STATUS = 'in_progress' | 'completed' | 'draw' | 'TIME_UP' | 'player_exit';

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private moves: move[];
    private time: Date;
    private board: Chess;
    private gameId: string | null;
    private playerId1: string;
    private playerId2: string;

    constructor(websocket: WebSocket, websocket2: WebSocket, playerId1: string, playerId2: string) {
        this.time = new Date();
        this.board = new Chess();
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

    private async createGameInDB() {
        try {
            const query = `
                INSERT INTO games (white_player_id, black_player_id, result)
                VALUES ($1, $2, 'in_progress')
                RETURNING game_id
            `;
            const values = [this.playerId1, this.playerId2];
            const result = await pool.query(query, values);
            this.gameId = result.rows[0].game_id;

            console.log("Game stored in DB with ID:", this.gameId);
        } catch (error) {
            console.error("Error creating game in DB:", error);
        }
    }

    public async makeMove(player: WebSocket, move: move, playerId: string) {
        const isPlayer1 = this.moves.length % 2 === 0;
        const isPlayer2 = this.moves.length % 2 === 1;

        if ((isPlayer1 && player === this.player1) || (isPlayer2 && player === this.player2)) {
            try {
                const moveResult = this.board.move(move);

                if (!moveResult) {
                    throw new Error("Invalid move");
                }

                await this.storeMoveInDB(move, playerId);
                const otherPlayer = isPlayer1 ? this.player2 : this.player1;

                    otherPlayer.send(JSON.stringify({
                        "type": MOVE,
                        "playerId": playerId,
                        "move": move
                    }));
                    

                if (!this.board.isGameOver()) {
                    

                    this.moves.push(move);
                } else {

                    await this.notifyGameOver();
                }
            } catch (error) {
                console.error("Error making move:", error);
                player.send(JSON.stringify({ "type": "error", "message": "Invalid move!" }));
            }
        } else {
            player.send(JSON.stringify({ "type": "error", "message": "It's not your turn!" }));
        }
    }

    public async handleLeave(user: WebSocket) {
        const LivePlayer = user === this.player1 ? this.player2 : this.player1;

        LivePlayer.send(JSON.stringify({
            type: ABANDONED,
            message: "One of the players left the game",
        }));

        user.send(JSON.stringify({
            type: ABANDONED,
            message: "You have left the game",
        }));

        await this.removeGameInDB();
    }
    public handleMessage(message: string,userId:string){
        const Receiver:WebSocket = (userId===this.playerId1)? this.player2: this.player1;
        const ReceiverId:string = (userId===this.playerId1)? this.playerId2: this.playerId1;
        try{
            console.log(JSON.stringify({type: 'chat',ChatContent: message ,playerId:ReceiverId}));

        Receiver.send(JSON.stringify({type: 'chat',ChatContent: message ,playerId:ReceiverId}));
        }
        catch(e:any){
            console.error(e);

        }

    }

    private async storeMoveInDB(move: move, playerId: string) {
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
            await pool.query(query, values);

            console.log("Move stored in DB");
        } catch (error) {
            console.error("Error storing move in DB:", error);
        }
    }

    private async notifyGameOver() {
        const gameStatus: GAME_STATUS = this.board.isDraw() ? "draw" : "completed";
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
            await pool.query(query, values);

            this.player1.send(JSON.stringify({ type: "gameOver", status: gameStatus }));
            this.player2.send(JSON.stringify({ type: "gameOver", status: gameStatus }));
            

            console.log("Game over. Status updated in database.");
        } catch (error) {
            console.error("Error notifying game over:", error);
        }
    }

    private async removeGameInDB() {
        const gameStatus: GAME_STATUS = 'player_exit';
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
            await pool.query(query, values);

            console.log("Game status updated to 'player_exit' in database");
        } catch (error) {
            console.error("Error removing game from database:", error);
        }
    }
}
