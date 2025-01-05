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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../DB/db"));
const fetchGames = (Id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      SELECT game_id, white_player_id, black_player_id, result, start_time, end_time,winner_id
      FROM games
      WHERE white_player_id = $1 OR black_player_id = $1 AND result!= 'in_progress'
    `;
    try {
        const { rows } = yield db_1.default.query(query, [Id]);
        if (rows.length > 0) {
            console.log(rows);
            res.status(200).json({ games: rows });
        }
        else {
            res.status(404).json({ message: "No games found for this user." });
        }
    }
    catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = fetchGames;
