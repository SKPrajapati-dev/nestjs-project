import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.getUserByUsername(username);
        if(user){
            const isMatch = await this.usersService.compareHash(pass, user.password);
            if(isMatch){
                const { password, ...result } = user;
                return result;
            }
        } 
        return null;
    }
}
