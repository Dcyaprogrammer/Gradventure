/**
 * Gradventure Backend Server
 * Main server file with authentication and API routes
 */

import { getConnection } from './db/db.js';
import { createAuthMiddleware, unauthorizedResponse } from './middleware/auth.js';
import * as authRoutes from './api/auth.js';

// Get database connection
const db = getConnection();

// Create authentication middleware
const authenticate = createAuthMiddleware(db);

// Start server
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // ============================================
      // AUTHENTICATION ROUTES (Public)
      // ============================================

      // POST /api/auth/register - Register new user
      if (url.pathname === '/api/auth/register' && method === 'POST') {
        const response = await authRoutes.register(req);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // POST /api/auth/login - Login user
      if (url.pathname === '/api/auth/login' && method === 'POST') {
        const response = await authRoutes.login(req);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ============================================
      // PROTECTED ROUTES (Require Authentication)
      // ============================================

      // GET /api/auth/me - Get current user
      if (url.pathname === '/api/auth/me' && method === 'GET') {
        const authResult = await authenticate(req);

        if (!authResult.success) {
          return unauthorizedResponse(authResult.error);
        }

        const response = await authRoutes.getCurrentUser(req);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // PUT /api/auth/password - Change password
      if (url.pathname === '/api/auth/password' && method === 'PUT') {
        const authResult = await authenticate(req);

        if (!authResult.success) {
          return unauthorizedResponse(authResult.error);
        }

        const response = await authRoutes.changePassword(req);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ============================================
      // LESSON ROUTES (Public for now, can be protected)
      // ============================================

      // GET /api/lessons - Get all lessons
      if (url.pathname === '/api/lessons' && method === 'GET') {
        const lessons = await db`
          SELECT id, title, description, category, difficulty, experience_reward
          FROM lessons
          ORDER BY difficulty, id
        `;

        return new Response(
          JSON.stringify({
            success: true,
            data: lessons,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // GET /api/lessons/:id - Get specific lesson
      const lessonMatch = url.pathname.match(/^\/api\/lessons\/(\d+)$/);
      if (lessonMatch && method === 'GET') {
        const lessonId = parseInt(lessonMatch[1]);

        const lessons = await db`
          SELECT * FROM lessons WHERE id = ${lessonId}
        `;

        if (lessons.length === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Lesson not found',
            }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const questions = await db`
          SELECT id, question_text, options, explanation
          FROM questions
          WHERE lesson_id = ${lessonId}
          ORDER BY id
        `;

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              ...lessons[0],
              questions,
            },
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // ============================================
      // USER PROGRESS ROUTES (Protected)
      // ============================================

      // GET /api/users/:id/progress - Get user progress
      const progressMatch = url.pathname.match(/^\/api\/users\/(\d+)\/progress$/);
      if (progressMatch && method === 'GET') {
        const authResult = await authenticate(req);

        if (!authResult.success) {
          return unauthorizedResponse(authResult.error);
        }

        const requestingUserId = parseInt(progressMatch[1]);

        // Users can only view their own progress
        if (req.userId !== requestingUserId) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'You can only view your own progress',
            }),
            {
              status: 403,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const progress = await db`
          SELECT * FROM user_progress WHERE user_id = ${requestingUserId}
        `;

        if (progress.length === 0) {
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                user_id: requestingUserId,
                level: 1,
                experience_points: 0,
                completed_lessons: [],
                badges: [],
              },
            }),
            {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            data: progress[0],
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // ============================================
      // HEALTH CHECK
      // ============================================

      // GET /health - Health check endpoint
      if (url.pathname === '/health' && method === 'GET') {
        return new Response(
          JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // GET / - Root endpoint
      if (url.pathname === '/' && method === 'GET') {
        return new Response(
          JSON.stringify({
            message: 'Gradventure API',
            version: '1.0.0',
            endpoints: {
              auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                me: 'GET /api/auth/me',
                changePassword: 'PUT /api/auth/password',
              },
              lessons: {
                list: 'GET /api/lessons',
                detail: 'GET /api/lessons/:id',
              },
              progress: {
                get: 'GET /api/users/:id/progress',
              },
              health: 'GET /health',
            },
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // 404 - Not Found
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Not Found',
          message: 'The requested endpoint does not exist',
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error: any) {
      console.error('Server error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal Server Error',
          message: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
});

console.log(`
🚀 Gradventure API Server Started!

   Server: http://localhost:${server.port}
   Health: http://localhost:${server.port}/health

📚 Available Endpoints:

   Authentication:
     POST   /api/auth/register    - Register new user (XJTLU email only)
     POST   /api/auth/login       - Login user
     GET    /api/auth/me          - Get current user (requires auth)
     PUT    /api/auth/password    - Change password (requires auth)

   Lessons:
     GET    /api/lessons          - Get all lessons
     GET    /api/lessons/:id      - Get specific lesson with questions

   Progress:
     GET    /api/users/:id/progress - Get user progress (requires auth)

   System:
     GET    /health               - Health check
     GET    /                     - API documentation

✅ Server is ready to accept requests
`);

export default server;
