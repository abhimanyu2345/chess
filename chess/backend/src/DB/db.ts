import { config } from "dotenv";

const { Pool } = require('pg');

// Load environment variables from .env file

config();
// Set up the connection configuration using environment variables
export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

// Test the connection when the app starts
export const db_Connect = async () => {
  
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Connected to PostgreSQL:', res.rows[0]);
    client.release();  // Release the client back to the pool
  } catch (err:any) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  }
};

// Call dbconnect once to check the connection, but still export the pool
export default pool
// Export the pool to use in other files

