import pool from "../../DB/db";
import passwordHasher from "./passwordHasher";
import { app } from "../express_serever";
import { Response } from "express";
import generateToken from "../../token_components/token_generation";

const insertData = async (username: string, password: string, email: string, res: Response) => {
  try {
    console.log("Received signup data:", { username, email, password });
    
    const hashedPassword = await passwordHasher(password);
    console.log("Password hashed successfully");

    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING user_id, username, email, password_hash, created_at;
    `;
    
    console.log("Executing query:", query);
    const result = await pool.query(query, [username, email, hashedPassword]);
    
    if (!result.rows.length) {
      console.error("User insertion failed: No rows returned.");
      return res.status(500).json({ message: "User insertion failed" });
    }
    const token= generateToken({ Id:result.rows[0].user_id, 
      username:result.rows[0].username,
      email:result.rows[0].email,});
    console.log("User inserted successfully:");
    res.cookie("authToken", token, {
      httpOnly: true,  // Cookie cannot be accessed via JavaScript
      secure:true, // Use false in dev for non-HTTPS environments
      sameSite: "None", // Allows cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    
    return res.status(200).json("Signup successful");
  } catch (err) {
    console.error(`Error inserting user: ${err.stack}`);
    return res.status(400).json({ message: `Error inserting user: ${err.message}` });
  }
};

export default insertData;
