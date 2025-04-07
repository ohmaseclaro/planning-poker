import { Module } from '@nestjs/common';
import { RedisController } from './redis.controller';

@Module({
  imports: [],
  controllers: [RedisController],
  providers: [RedisController],
  exports: [RedisController],
})
export class RedisModule {}
