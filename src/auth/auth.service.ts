import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';
import { User } from 'src/users/users.entity';
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

    async validateGoogleUser(profile: Profile): Promise<User> {
        const { provider, id: providerId} = profile;
        const user = await this.usersService.getUserByProvider(provider, providerId);
        if(user) {
            return user;
        } else {
            // addUser
            const newUser = await this.usersService.addUserWithoutPassword({
                provider,
                providerId,
                name: profile.displayName,
                username: profile.displayName
            })
            return newUser
        }
    }
}
