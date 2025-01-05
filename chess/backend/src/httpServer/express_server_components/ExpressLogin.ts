import { Response } from "express";
import pool from "../../DB/db";
import tokenAuth from "../../token_components/tokenAuth";
import generateToken from "../../token_components/token_generation";

const bcrypt = require('bcrypt');


export default async function Login(username: string, password: string, res: Response) {
  const query = `SELECT  * FROM users WHERE username=$1`;
  
  try {
    const response = await pool.query(query, [username]);

    if (response.rows.length > 0) {
      const validationResult = await bcrypt.compare(password, response.rows[0].password_hash);

      if (validationResult) {
        
        const token= generateToken({ Id:response.rows[0].user_id, 
          username:response.rows[0].username,
          email:response.rows[0].email,});
        
        res.cookie("authToken", token, {
          httpOnly: true,  // Cookie cannot be accessed via JavaScript
          secure:true, // Use false in dev for non-HTTPS environments
          sameSite: "None", // Allows cross-origin cookies
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        
        return res.status(200).send("Validation successful");
      } else {
        return res.status(401).send("Invalid password");
      }
    } else {
      return res.status(401).send("User not found");
    }

  } catch (err: any) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};