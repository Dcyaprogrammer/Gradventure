/**
 * PostgreSQL Database Configuration for Gradventure
 *
 * This module handles the PostgreSQL connection using the `postgres` library
 * which works great with Bun.
 */

import postgres from 'postgres';

// Database configuration
const DB_CONFIG = {
  host: 'localhost',
  port: 5433,
  database: 'gradventure',
  user: 'dopamine',
};

// Connection singleton
let sql: postgres.Sql<any> | null = null;

/**
 * Get or create database connection
 */
export function getConnection(): postgres.Sql<any> {
  if (!sql) {
    sql = postgres(DB_CONFIG);
    console.log('Database connection established');
  }
  return sql;
}

/**
 * Execute a SQL query
 */
export async function query<T = any>(sqlString: string, params?: any[]): Promise<T[]> {
  const conn = getConnection();
  try {
    const result = await conn.unsafe(sqlString, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeConnection() {
  if (sql) {
    await sql.end();
    sql = null;
    console.log('Database connection closed');
  }
}

// Initialize database schema
export async function initSchema() {
  try {
    // Check if tables already exist
    const tables = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `);

    if (tables.length > 0) {
      console.log('Tables already exist, skipping schema initialization');
      return;
    }

    // Users table
    await query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User progress table
    await query(`
      CREATE TABLE user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        level INTEGER DEFAULT 1,
        experience_points INTEGER DEFAULT 0,
        completed_lessons INTEGER[] DEFAULT '{}',
        badges TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lessons table
    await query(`
      CREATE TABLE lessons (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        difficulty INTEGER DEFAULT 1,
        content JSONB,
        experience_reward INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Questions table
    await query(`
      CREATE TABLE questions (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_answer INTEGER NOT NULL,
        explanation TEXT
      )
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
}

export default { getConnection, query, closeConnection, initSchema };
