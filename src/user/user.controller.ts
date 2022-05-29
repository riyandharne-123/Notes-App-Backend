/* eslint-disable prettier/prettier */
import { Controller, Body, Post, Request, Get, UseGuards } from '@nestjs/common';

//services
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';

//dtos
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('auth')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/register')
    async register(@Body() userRegisterDto: UserRegisterDto): Promise<any> {
        return this.userService.register(userRegisterDto);
    }

    @Post('/login')
    async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
        return this.userService.login(userLoginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/user')
    async user(@Request() req): Promise<any> {
        return req.user
    }
}
  