/**
 * Authentication middleware for protecting API routes
 */

import { verifyToken, extractTokenFromHeader } from '../utils/auth.js';
import type { postgres } from 'postgres';

export interface AuthenticatedRequest extends Request {
  userId?: number;
  userEmail?: string;
  username?: string;
}

/**
 * Authentication middleware factory
 * Creates a middleware function that validates JWT tokens
 */
export function createAuthMiddleware(db: postgres.Sql<any>) {
  return async (req: AuthenticatedRequest): Promise<{
    success: boolean;
    error?: string;
    user?: { userId: number; email: string; username: string };
  }> => {
    // Extract token from Authorization header
    const authHeader = req.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return {
        success: false,
        error: 'No authorization token provided',
      };
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return {
        success: false,
        error: 'Invalid or expired token',
      };
    }

    // Verify user still exists in database
    const users = await db`
      SELECT id, email, username
      FROM users
      WHERE id = ${decoded.userId}
      LIMIT 1
    `;

    if (users.length === 0) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.username = decoded.username;

    return {
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username,
      },
    };
  };
}

/**
 * Helper function to create unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return Response.json(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  );
}

/**
 * Helper function to create forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden') {
  return Response.json(
    {
      success: false,
      error: message,
    },
    { status: 403 }
  );
}

export default { createAuthMiddleware, unauthorizedResponse, forbiddenResponse };
