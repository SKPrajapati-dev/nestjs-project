import { Body, Controller, Get, Logger, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { AddUserDto } from './dto/add-user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get('/')
    async getAllUsers(): Promise<User[]> {
        return await this.userService.getAllUsers();
    }

    @Get('/userid/:userid')
    async getUserByUserId(@Param('userid') userId: string): Promise<any> {
        const user = await this.userService.getUserByUserId(userId);
        if(!user){
            throw new NotFoundException('User does not exist');
        }
        return user;
    }

    @Get('username')
    async getUserByUsername(@Query('username') username: string): Promise<any> {
        const user = await this.userService.getUserByUsername(username);
        if(!user){
            throw new NotFoundException('User does not exist');
        }
        const removed= User.removePassword(user);
        return removed;
    }

    @Post('/')
    async addUser(@Body() newUser: AddUserDto): Promise<User> {
        return await this.userService.addUser(newUser);
    }
}
