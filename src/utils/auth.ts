/**
 * Authentication utilities for Gradventure
 * Handles JWT tokens, password hashing, and XJTLU email validation
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'gradventure-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

/**
 * XJTLU email domains
 */
const XJTLU_EMAIL_DOMAINS = [
  'student.xjtlu.edu.cn',
  'xjtlu.edu.cn'
];

/**
 * Validate XJTLU email address
 * @param email - Email to validate
 * @returns true if valid XJTLU email, false otherwise
 */
export function isValidXJTLUEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  const domain = email.split('@')[1];
  return XJTLU_EMAIL_DOMAINS.includes(domain);
}

/**
 * Extract student ID from XJTLU student email
 * @param email - Student email (e.g., student123@student.xjtlu.edu.cn)
 * @returns Student ID or null
 */
export function extractStudentId(email: string): string | null {
  if (!email.endsWith('@student.xjtlu.edu.cn')) {
    return null;
  }

  const studentId = email.split('@')[0];
  return studentId || null;
}

/**
 * Hash password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password with hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password
 * @returns true if passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate JWT token
 * @param payload - Token payload (usually user data)
 * @returns JWT token
 */
export function generateToken(payload: {
  userId: number;
  email: string;
  username: string;
}): string {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}

/**
 * Verify JWT token
 * @param token - JWT token
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): {
  userId: number;
  email: string;
  username: string;
} | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      username: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with isValid flag and message
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  return {
    isValid: true,
    message: 'Password is valid',
  };
}

/**
 * Validate username
 * @param username - Username to validate
 * @returns Object with isValid flag and message
 */
export function validateUsername(username: string): {
  isValid: boolean;
  message: string;
} {
  if (username.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters long',
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      message: 'Username must be no more than 20 characters long',
    };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, underscores, and hyphens',
    };
  }

  return {
    isValid: true,
    message: 'Username is valid',
  };
}

export default {
  isValidXJTLUEmail,
  extractStudentId,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  validatePassword,
  validateUsername,
};
