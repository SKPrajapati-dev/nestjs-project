import { Body, Controller, Delete, Get, Logger, NotFoundException, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
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

    // Protected
    @UseGuards(AuthenticatedGuard)
    @Get('/userid')
    async getUserByUserId(@Request() req): Promise<any> {
        const user = await this.userService.getUserByUserId(req.user.id);
        if(!user){
            throw new NotFoundException('User does not exist');
        }
        const { password, ...result  } = user;
        return result;
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

    @UseGuards(AuthenticatedGuard)
    @Delete('/')
    async deleteUser(@Request() req) {
        return await this.userService.deleteUser(req.user.id);
    }
}
