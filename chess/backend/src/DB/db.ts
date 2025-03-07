import { config } from "dotenv";

const { Pool } = require('pg');


config(); // Load .env variables

// Create a new database pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Supabase
});

// Function to test the database connection
export const db_Connect = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT NOW()");
    console.log("✅ Connected to Supabase:", res.rows[0]);
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error("❌ Error connecting to Supabase:", err.message);
  }
};

// Test connection when the app starts
db_Connect();

// Export the pool for queries
export default pool;
