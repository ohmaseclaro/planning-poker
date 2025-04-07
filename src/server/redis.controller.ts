import { Controller, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { findOptimalPosition, MAX_USERS } from './positionUtils';

interface User {
  id: string;
  name: string;
  vote: number | null;
  avatar?: string;
  position?: number;
}

@Controller()
export class RedisController implements OnModuleInit {
  private rooms: Map<string, Map<string, User>> = new Map();
  private userRooms: Map<string, Set<string>> = new Map();
  private roomPositions: Map<string, Map<string, number>> = new Map();
  private roomLastActivity: Map<string, number> = new Map();
  private cleanupInterval: NodeJS.Timeout;
  private roomIdleTimeout: number;

  constructor() {
    // Default to 1 hour (3600 seconds) if not specified in .env
    this.roomIdleTimeout = parseInt(process.env.ROOM_IDLE_TIMEOUT || '3600', 10) * 1000;
  }

  onModuleInit() {
    // Start the cleanup loop when the module initializes
    this.cleanupInterval = setInterval(() => this.cleanupIdleRooms(), 1000);
    console.log(
      `Room cleanup service started. Idle timeout set to ${this.roomIdleTimeout / 1000} seconds.`
    );
  }

  // Update the room activity timestamp whenever there's interaction with a room
  private updateRoomActivity(roomId: string): void {
    this.roomLastActivity.set(roomId, Date.now());
  }

  // Clean up rooms that have been idle for longer than the specified timeout
  private cleanupIdleRooms(): void {
    const now = Date.now();
    const idleRooms: string[] = [];

    // Find idle rooms
    this.roomLastActivity.forEach((lastActivity, roomId) => {
      if (now - lastActivity > this.roomIdleTimeout) {
        idleRooms.push(roomId);
      }
    });

    // Clean up each idle room
    idleRooms.forEach((roomId) => {
      console.log(
        `Cleaning up idle room: ${roomId} (inactive for ${
          (now - this.roomLastActivity.get(roomId)) / 1000
        } seconds)`
      );

      // Remove all users from the room
      if (this.rooms.has(roomId)) {
        const userIds = Array.from(this.rooms.get(roomId).keys());

        // Remove room from each user's room list
        userIds.forEach((userId) => {
          if (this.userRooms.has(userId)) {
            this.userRooms.get(userId).delete(roomId);

            // Clean up user if they're not in any rooms anymore
            if (this.userRooms.get(userId).size === 0) {
              this.userRooms.delete(userId);
            }
          }
        });

        // Delete the room and its positions
        this.rooms.delete(roomId);
        this.roomPositions.delete(roomId);
        this.roomLastActivity.delete(roomId);
      }
    });
  }

  @MessagePattern({ cmd: 'addUserToRoom' })
  addUserToRoom(data: { roomId: string; user: User }): boolean {
    const { roomId, user } = data;

    // Create room if it doesn't exist
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Map());
      this.roomPositions.set(roomId, new Map());
    }

    // Preserve existing position if the user is rejoining
    const positionsMap = this.roomPositions.get(roomId);
    if (positionsMap.has(user.id)) {
      // User is rejoining, use their existing position
      user.position = positionsMap.get(user.id);
    } else if (user.position === undefined) {
      // Assign an optimal position for the new user
      user.position = findOptimalPosition(Object.fromEntries(positionsMap));
      positionsMap.set(user.id, user.position);
    }

    // Add user to room
    this.rooms.get(roomId).set(user.id, user);

    // Track which rooms the user is in
    if (!this.userRooms.has(user.id)) {
      this.userRooms.set(user.id, new Set());
    }
    this.userRooms.get(user.id).add(roomId);

    // Update room activity
    this.updateRoomActivity(roomId);

    return true;
  }

  @MessagePattern({ cmd: 'getRoomUsers' })
  getRoomUsers(data: { roomId: string }): User[] {
    const { roomId } = data;

    if (!this.rooms.has(roomId)) {
      return [];
    }

    // Update room activity
    this.updateRoomActivity(roomId);

    const users = Array.from(this.rooms.get(roomId).values());

    // Ensure all users have positions
    users.forEach((user) => {
      if (user.position === undefined) {
        // Initialize roomPositions for this room if it doesn't exist
        if (!this.roomPositions.has(roomId)) {
          this.roomPositions.set(roomId, new Map());
        }
        const positionsMap = this.roomPositions.get(roomId);

        // Check if user already has a position in the positions map
        if (positionsMap.has(user.id)) {
          user.position = positionsMap.get(user.id);
        } else {
          // Find a new optimal position if user doesn't have one
          user.position = findOptimalPosition(Object.fromEntries(positionsMap));
          positionsMap.set(user.id, user.position);
        }
      }
    });

    return users;
  }

  @MessagePattern({ cmd: 'updateUserVote' })
  updateUserVote(data: { roomId: string; userId: string; vote: number }): boolean {
    const { roomId, userId, vote } = data;

    if (!this.rooms.has(roomId) || !this.rooms.get(roomId).has(userId)) {
      return false;
    }

    // Update room activity
    this.updateRoomActivity(roomId);

    const user = this.rooms.get(roomId).get(userId);
    user.vote = vote;
    this.rooms.get(roomId).set(userId, user);

    return true;
  }

  @MessagePattern({ cmd: 'resetRoomVotes' })
  resetRoomVotes(data: { roomId: string }): boolean {
    const { roomId } = data;

    if (!this.rooms.has(roomId)) {
      return false;
    }

    // Update room activity
    this.updateRoomActivity(roomId);

    for (const user of this.rooms.get(roomId).values()) {
      user.vote = null;
      this.rooms.get(roomId).set(user.id, user);
    }

    return true;
  }

  @MessagePattern({ cmd: 'removeUserFromRoom' })
  removeUserFromRoom(data: { roomId: string; userId: string }): boolean {
    const { roomId, userId } = data;

    if (!this.rooms.has(roomId)) {
      return false;
    }

    // Update room activity
    this.updateRoomActivity(roomId);

    // Remove user from room
    this.rooms.get(roomId).delete(userId);

    // Remove user's position
    if (this.roomPositions.has(roomId)) {
      this.roomPositions.get(roomId).delete(userId);
    }

    // Remove room from user's room list
    if (this.userRooms.has(userId)) {
      this.userRooms.get(userId).delete(roomId);
    }

    // Clean up empty rooms
    if (this.rooms.get(roomId).size === 0) {
      this.rooms.delete(roomId);
      this.roomPositions.delete(roomId);
      this.roomLastActivity.delete(roomId);
    }

    return true;
  }

  @MessagePattern({ cmd: 'getUserRooms' })
  getUserRooms(data: { userId: string }): string[] {
    const { userId } = data;

    if (!this.userRooms.has(userId)) {
      return [];
    }

    // Update activity for all user's rooms
    const userRooms = Array.from(this.userRooms.get(userId));
    userRooms.forEach((roomId) => this.updateRoomActivity(roomId));

    return userRooms;
  }

  @MessagePattern({ cmd: 'updateUserAvatar' })
  updateUserAvatar(data: { roomId: string; userId: string; avatar: string }): boolean {
    const { roomId, userId, avatar } = data;

    if (!this.rooms.has(roomId) || !this.rooms.get(roomId).has(userId)) {
      return false;
    }

    // Update room activity
    this.updateRoomActivity(roomId);

    const user = this.rooms.get(roomId).get(userId);
    user.avatar = avatar;
    // Ensure we preserve the user's position when updating the avatar
    if (this.roomPositions.has(roomId) && this.roomPositions.get(roomId).has(userId)) {
      user.position = this.roomPositions.get(roomId).get(userId);
    }
    this.rooms.get(roomId).set(userId, user);

    return true;
  }

  @MessagePattern({ cmd: 'getUserPosition' })
  getUserPosition(data: { roomId: string; userId: string }): number | null {
    const { roomId, userId } = data;

    if (!this.roomPositions.has(roomId) || !this.roomPositions.get(roomId).has(userId)) {
      return null;
    }

    // Update room activity
    this.updateRoomActivity(roomId);

    return this.roomPositions.get(roomId).get(userId);
  }

  @MessagePattern({ cmd: 'getAllPositions' })
  getAllPositions(data: { roomId: string }): Record<string, number> {
    const { roomId } = data;

    if (!this.roomPositions.has(roomId)) {
      return {};
    }

    // Update room activity
    this.updateRoomActivity(roomId);

    return Object.fromEntries(this.roomPositions.get(roomId));
  }
}
