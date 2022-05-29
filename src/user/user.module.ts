/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

//controllers
import { UserController } from './user.controller';

//services
import { UserService } from './user.service';
import { JwtStrategy } from '../jwt/jwt.strategy';

//schema
import { User, UserSchema } from './user.schema'

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: User.name,
                    schema: UserSchema
                },
            ]
        ),
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: 'jwt-secret',
            signOptions: {
              expiresIn: 3600,
            }
        }),
    ],
    controllers: [UserController],
    providers: [UserService, JwtStrategy]
})
export class UserModule {}