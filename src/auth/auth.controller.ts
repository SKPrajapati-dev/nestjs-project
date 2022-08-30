import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
        return req.user;
    }

    @UseGuards(GoogleAuthGuard)
    @Get('/google')
    async googleLogin(@Request() req) {}

    @UseGuards(GoogleAuthGuard)
    @Get('/google/redirect')
    async googleCallback(@Request() req) {
        return { user: req.user }
    }

    @Get('/logout')
    logout(@Request() req): any {
        req.session.destroy();
        return { msg: 'Thew user session has ended'}
    }
}
