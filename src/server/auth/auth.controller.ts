import { Controller, Post, Get, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', message: 'Auth controller is working' };
  }

  @Post('token')
  generateToken(@Body() body: { password: string }) {
    try {
      const { password } = body;
      const token = this.authService.validatePassword(password);
      return { token };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Authentication failed');
    }
  }
}
