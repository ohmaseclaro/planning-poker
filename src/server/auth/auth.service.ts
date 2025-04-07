import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  /**
   * Validates the provided password against the environment variable
   * and generates a JWT token if valid
   */
  validatePassword(password: string): string {
    const validPassword = process.env.APP_PASSWORD;

    if (!validPassword) {
      throw new Error('APP_PASSWORD environment variable is not set');
    }

    if (password !== validPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    // Generate token
    return this.generateToken();
  }

  /**
   * Generates a JWT token
   */
  generateToken(): string {
    const payload = { sub: 'planning-poker-user' };
    return sign(payload, process.env.JWT_SECRET);
  }

  /**
   * Verifies a JWT token
   */
  verifyToken(token: string): any {
    try {
      return verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
