/* eslint-disable prettier/prettier */
import { CacheModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.register(),
  ],
  providers: [RedisService]
})
export class RedisModule {}