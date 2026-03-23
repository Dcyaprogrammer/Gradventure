/**
 * Example API endpoints using Bun.serve() with PostgreSQL
 * This demonstrates how to structure your backend API
 */

import { query } from '../db/db';

// Example API handlers
export const apiHandlers = {
  // GET /api/lessons - Get all lessons
  '/api/lessons': async (req: Request) => {
    if (req.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const lessons = await query(`
        SELECT id, title, description, category, difficulty, experience_reward
        FROM lessons
        ORDER BY difficulty, id
      `);

      return Response.json({
        success: true,
        data: lessons
      });
    } catch (error) {
      return Response.json({
        success: false,
        error: 'Failed to fetch lessons'
      }, { status: 500 });
    }
  },

  // GET /api/lessons/:id - Get a specific lesson with questions
  '/api/lessons/:id': async (req: Request, params: { id: string }) => {
    if (req.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const lessonId = parseInt(params.id);

      const lessons = await query(`
        SELECT * FROM lessons WHERE id = $1
      `, [lessonId]);

      if (lessons.length === 0) {
        return Response.json({
          success: false,
          error: 'Lesson not found'
        }, { status: 404 });
      }

      const questions = await query(`
        SELECT id, question_text, options, explanation
        FROM questions
        WHERE lesson_id = $1
        ORDER BY id
      `, [lessonId]);

      return Response.json({
        success: true,
        data: {
          ...lessons[0],
          questions
        }
      });
    } catch (error) {
      return Response.json({
        success: false,
        error: 'Failed to fetch lesson'
      }, { status: 500 });
    }
  },

  // POST /api/users - Create a new user
  '/api/users': async (req: Request) => {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const body = await req.json();
      const { username, email, password_hash } = body;

      const result = await query(`
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at
      `, [username, email, password_hash]);

      return Response.json({
        success: true,
        data: result[0]
      }, { status: 201 });
    } catch (error: any) {
      return Response.json({
        success: false,
        error: error.message || 'Failed to create user'
      }, { status: 500 });
    }
  },

  // GET /api/users/:id/progress - Get user progress
  '/api/users/:id/progress': async (req: Request, params: { id: string }) => {
    if (req.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const userId = parseInt(params.id);

      const progress = await query(`
        SELECT * FROM user_progress WHERE user_id = $1
      `, [userId]);

      if (progress.length === 0) {
        return Response.json({
          success: true,
          data: {
            user_id: userId,
            level: 1,
            experience_points: 0,
            completed_lessons: [],
            badges: []
          }
        });
      }

      return Response.json({
        success: true,
        data: progress[0]
      });
    } catch (error) {
      return Response.json({
        success: false,
        error: 'Failed to fetch progress'
      }, { status: 500 });
    }
  }
};

// Example server setup
export function createServer(port = 3000) {
  return Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);

      // Route handling
      if (url.pathname === '/api/lessons' && req.method === 'GET') {
        return apiHandlers['/api/lessons'](req);
      }

      // Dynamic route: /api/lessons/:id
      const lessonMatch = url.pathname.match(/^\/api\/lessons\/(\d+)$/);
      if (lessonMatch && req.method === 'GET') {
        return apiHandlers['/api/lessons/:id'](req, { id: lessonMatch[1] });
      }

      if (url.pathname === '/api/users' && req.method === 'POST') {
        return apiHandlers['/api/users'](req);
      }

      // Dynamic route: /api/users/:id/progress
      const progressMatch = url.pathname.match(/^\/api\/users\/(\d+)\/progress$/);
      if (progressMatch && req.method === 'GET') {
        return apiHandlers['/api/users/:id/progress'](req, { id: progressMatch[1] });
      }

      // 404 for unknown routes
      return new Response('Not Found', { status: 404 });
    },
  });
}

// Start server if this file is run directly
if (import.meta.main) {
  const server = createServer(3000);
  console.log(`Server running at http://localhost:${server.port}`);
}
