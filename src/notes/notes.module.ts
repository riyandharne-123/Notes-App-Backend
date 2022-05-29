/* eslint-disable prettier/prettier */
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './note.schema';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature(
        [
            {
              name: Note.name,
              schema: NoteSchema
            },
        ]
    ),
    CacheModule.registerAsync({
      useFactory: async() => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      })
    }),
  ],
  controllers: [NotesController],
  providers: [NotesService, RedisService]
})
export class NotesModule {}
