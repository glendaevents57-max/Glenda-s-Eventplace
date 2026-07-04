import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString: connectionString || undefined,
  // Add SSL configuration if connecting to Supabase (non-localhost)
  ssl: connectionString && (connectionString.includes("localhost") || connectionString.includes("127.0.0.1"))
    ? false
    : { rejectUnauthorized: false },
});

export async function query(text: string, params?: any[]) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in your environment variables. Please add it to your .env file.");
  }
  return pool.query(text, params);
}
