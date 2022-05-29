/* eslint-disable prettier/prettier */
//imports
import { Model } from 'mongoose';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

//dtos
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

//services
import { JwtService } from '@nestjs/jwt';

//schema
import { User, UserDocument } from './user.schema'

@Injectable()
export class UserService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ){}

    async register(userRegisterDto: UserRegisterDto): Promise<any> {
        //check if user with this email exists in this database
        const existingUser = await this.userModel.findOne()
        .where({
            email: userRegisterDto.email
        })
        .exec()

        if(existingUser != null) {
            return new ConflictException('User with this email already exists.');
        }

        //encrypting password
        userRegisterDto.password = await bcrypt.hash(userRegisterDto.password, 10);

        const user = await new this.userModel(userRegisterDto).save();
        const accessToken = await this.jwtService.sign({ user });

        return {
            'user': user,
            'token': accessToken
        };
    }

    async login(userLoginDto: UserLoginDto): Promise<any> {
        const user = await this.userModel.findOne()
        .where({
            email: userLoginDto.email
        })
        .exec()
        
        if(!user) {
            throw new UnauthorizedException('User does not exist.');
        }
        
        const password = await bcrypt.compare(userLoginDto.password, user.password);

        if(!password) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        const accessToken = await this.jwtService.sign({ user });

        return {
            'user': user,
            'token': accessToken
        };
    }
}