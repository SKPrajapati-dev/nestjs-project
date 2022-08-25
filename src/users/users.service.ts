import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { AddUserDto } from './dto/add-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}


    private async hashpassword(password: string): Promise<string> {
        return await hash(password, 10);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepo.find({});
    }

    async getUserByUserId(userId: string): Promise<User> {
        return await this.userRepo.findOne({ where: { id: userId }})
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.userRepo.findOne({ where: { username }})
    }

    async addUser(newUser: AddUserDto): Promise<User> {
        // username already exists check
        const username = await this.getUserByUsername(newUser.username)
        if(username){
            throw new ConflictException('This username is already taken!!');
        }
        const hashedPassword = await this.hashpassword(newUser.password);
        newUser.password = hashedPassword;
        return await this.userRepo.save(newUser)
    }
}
