import { Module } from '@nestjs/common';
import { PlanningPokerGateway } from './planning-poker.gateway';
import { RedisModule } from './redis.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RedisModule, AuthModule],
  controllers: [],
  providers: [PlanningPokerGateway],
})
export class AppModule {}
