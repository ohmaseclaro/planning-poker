import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisController } from './redis.controller';
import { Injectable, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { WsAuthGuard } from './auth/ws-auth.guard';

interface User {
  id: string;
  name: string;
  vote: number | null;
  avatar?: string;
  position?: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
  path: '/socket.io',
})
@Injectable()
export class PlanningPokerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly redisController: RedisController,
    private readonly authService: AuthService
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client attempting connection: ${client.id}`);

    try {
      // Verify the token from handshake auth
      const token = client.handshake.auth?.token;

      if (!token) {
        console.log(`Client ${client.id} rejected: No auth token provided`);
        client.disconnect();
        return;
      }

      this.authService.verifyToken(token);
      console.log(`Client authenticated: ${client.id}`);
    } catch (error) {
      console.log(`Client ${client.id} rejected: Invalid auth token`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    await this.removeUserFromAllRooms(client.id);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, payload: { roomId: string; name: string; avatar?: string }) {
    const { roomId, name, avatar } = payload;
    const user: User = { id: client.id, name, vote: null, avatar };

    // Check for duplicate login (same username in the same room)
    const existingSocketId = this.redisController.addUserToRoom({ roomId, user });

    if (existingSocketId) {
      console.log(`Duplicate login detected for user ${name} in room ${roomId}`);
      console.log(`Disconnecting previous session: ${existingSocketId}`);

      // Get the socket of the previous session and disconnect it
      const existingSocket = this.server.sockets.sockets.get(existingSocketId);
      if (existingSocket) {
        // Send a message to the client that will be disconnected
        existingSocket.emit('duplicate_login', {
          message: 'You have been disconnected because you logged in from another tab or browser.',
        });
        // Force disconnect the socket
        existingSocket.disconnect(true);
      }

      // Continue with adding the new user as normal
      client.join(roomId);
    } else {
      // Normal case (no duplicate)
      client.join(roomId);
    }

    const users = this.redisController.getRoomUsers({ roomId });
    this.server.to(roomId).emit('updateUsers', users);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('updateAvatar')
  async handleUpdateAvatar(client: Socket, payload: { roomId: string; avatar: string }) {
    const { roomId, avatar } = payload;
    this.redisController.updateUserAvatar({ roomId, userId: client.id, avatar });

    const users = this.redisController.getRoomUsers({ roomId });
    this.server.to(roomId).emit('updateUsers', users);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('updateUsername')
  async handleUpdateUsername(client: Socket, payload: { roomId: string; username: string }) {
    const { roomId, username } = payload;
    this.redisController.updateUserName({ roomId, userId: client.id, name: username });

    const users = this.redisController.getRoomUsers({ roomId });
    this.server.to(roomId).emit('updateUsers', users);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('throwEmoji')
  async handleThrowEmoji(
    client: Socket,
    payload: {
      roomId: string;
      emoji: string;
      targetId: string;
      sourceId: string;
    }
  ) {
    const { roomId, emoji, targetId, sourceId } = payload;
    this.server.to(roomId).emit('emojiThrown', { emoji, targetId, sourceId });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('vote')
  async handleVote(client: Socket, payload: { roomId: string; vote: number }) {
    const { roomId, vote } = payload;
    this.redisController.updateUserVote({ roomId, userId: client.id, vote });

    const users = this.redisController.getRoomUsers({ roomId });
    this.server.to(roomId).emit('updateUsers', users);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('showResults')
  async handleShowResults(client: Socket, payload: { roomId: string }) {
    const { roomId } = payload;
    this.server.to(roomId).emit('showResults');
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('resetVotes')
  async handleResetVotes(client: Socket, payload: { roomId: string }) {
    const { roomId } = payload;
    this.redisController.resetRoomVotes({ roomId });

    const users = this.redisController.getRoomUsers({ roomId });
    this.server.to(roomId).emit('resetVotes');
    this.server.to(roomId).emit('updateUsers', users);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('startTimer')
  async handleStartTimer(client: Socket, payload: { roomId: string; duration: number }) {
    const { roomId, duration } = payload;
    let timeLeft = duration;

    const interval = setInterval(() => {
      timeLeft--;
      this.server.to(roomId).emit('updateTimer', timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  private async removeUserFromAllRooms(userId: string) {
    const rooms = this.redisController.getUserRooms({ userId });

    for (const roomId of rooms) {
      this.redisController.removeUserFromRoom({ roomId, userId });
      const users = this.redisController.getRoomUsers({ roomId });
      this.server.to(roomId).emit('updateUsers', users);
    }
  }
}
