import { Response } from "express";
import pool from "../../DB/db";

const fetchGames=async(Id:string,res:Response)=>{
    const query = `
      SELECT game_id, white_player_id, black_player_id, result, start_time, end_time,winner_id
      FROM games
      WHERE white_player_id = $1 OR black_player_id = $1 AND result!= 'in_progress'
    `;
    try{
        
    
    
    const { rows } = await pool.query(query, [Id]);

    if (rows.length > 0) {
        console.log(rows);
      res.status(200).json({ games: rows });
    } else {
      res.status(404).json({ message: "No games found for this user." });
    }
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Internal server error' });
        
    }

}
export default fetchGames;