/**
 * Authentication API routes
 * Handles user registration, login, and token management
 */

import { getConnection } from '../db/db.js';
import {
  isValidXJTLUEmail,
  extractStudentId,
  hashPassword,
  comparePassword,
  generateToken,
  validatePassword,
  validateUsername,
} from '../utils/auth.js';
import type { postgres } from 'postgres';

/**
 * POST /api/auth/register
 * Register a new user with XJTLU email
 */
export async function register(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          error: 'Username, email, and password are required',
        },
        { status: 400 }
      );
    }

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return Response.json(
        {
          success: false,
          error: usernameValidation.message,
        },
        { status: 400 }
      );
    }

    // Validate XJTLU email
    if (!isValidXJTLUEmail(email)) {
      return Response.json(
        {
          success: false,
          error: 'Must use a valid XJTLU email address (@student.xjtlu.edu.cn or @xjtlu.edu.cn)',
        },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return Response.json(
        {
          success: false,
          error: passwordValidation.message,
        },
        { status: 400 }
      );
    }

    const db = getConnection();

    // Check if email already exists
    const existingUsers = await db`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;

    if (existingUsers.length > 0) {
      return Response.json(
        {
          success: false,
          error: 'Email already registered',
        },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsernames = await db`
      SELECT id FROM users WHERE username = ${username} LIMIT 1
    `;

    if (existingUsernames.length > 0) {
      return Response.json(
        {
          success: false,
          error: 'Username already taken',
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Extract student ID if applicable
    const studentId = extractStudentId(email);

    // Create user
    const users = await db`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${passwordHash})
      RETURNING id, username, email, created_at
    `;

    const user = users[0];

    // Create user progress record
    await db`
      INSERT INTO user_progress (user_id, level, experience_points)
      VALUES (${user.id}, 1, 0)
    `;

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return Response.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            studentId: studentId || undefined,
            createdAt: user.created_at,
          },
          token,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to register user',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/login
 * Login with email and password
 */
export async function login(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return Response.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    const db = getConnection();

    // Find user by email
    const users = await db`
      SELECT id, username, email, password_hash
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          error: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Extract student ID if applicable
    const studentId = extractStudentId(user.email);

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return Response.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          studentId: studentId || undefined,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to login',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/me
 * Get current user information (requires authentication)
 */
export async function getCurrentUser(req: Request & { userId?: number; userEmail?: string; username?: string }) {
  try {
    const db = getConnection();

    // Get user from database
    const users = await db`
      SELECT id, username, email, created_at
      FROM users
      WHERE id = ${req.userId}
      LIMIT 1
    `;

    if (users.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    const user = users[0];

    // Get user progress
    const progress = await db`
      SELECT level, experience_points, completed_lessons, badges
      FROM user_progress
      WHERE user_id = ${user.id}
      LIMIT 1
    `;

    // Extract student ID if applicable
    const studentId = extractStudentId(user.email);

    return Response.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          studentId: studentId || undefined,
          createdAt: user.created_at,
        },
        progress: progress[0] || {
          level: 1,
          experience_points: 0,
          completed_lessons: [],
          badges: [],
        },
      },
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to get user information',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/password
 * Change password (requires authentication)
 */
export async function changePassword(req: Request & { userId?: number }) {
  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return Response.json(
        {
          success: false,
          error: 'Current password and new password are required',
        },
        { status: 400 }
      );
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return Response.json(
        {
          success: false,
          error: passwordValidation.message,
        },
        { status: 400 }
      );
    }

    const db = getConnection();

    // Get user with current password
    const users = await db`
      SELECT password_hash
      FROM users
      WHERE id = ${req.userId}
      LIMIT 1
    `;

    if (users.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, users[0].password_hash);

    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          error: 'Current password is incorrect',
        },
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await db`
      UPDATE users
      SET password_hash = ${newPasswordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.userId}
    `;

    return Response.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to change password',
      },
      { status: 500 }
    );
  }
}

export default { register, login, getCurrentUser, changePassword };
