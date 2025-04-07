import { CanActivate, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: any): boolean | Promise<boolean> | Observable<boolean> {
    // Extract the socket instance
    const client: Socket = context.switchToWs().getClient();
    const authToken = client.handshake.auth?.token;

    if (!authToken) {
      return false;
    }

    try {
      // Verify the token
      this.authService.verifyToken(authToken);
      return true;
    } catch (error) {
      return false;
    }
  }
}
