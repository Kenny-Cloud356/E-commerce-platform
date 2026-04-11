const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || "ecommerce",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err);
  process.exit(-1);
});

const connectDB = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT NOW()");
    console.log(`PostgreSQL connected: ${res.rows[0].now}`);
  } finally {
    client.release();
  }
};

module.exports = { pool, connectDB };
