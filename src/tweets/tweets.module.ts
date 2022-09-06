import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { TweetsController } from './tweets.controller';
import { Tweet } from './tweets.entity';
import { TweetsService } from './tweets.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Tweet, User]),
        UsersModule
    ],
    controllers: [TweetsController],
    providers: [TweetsService],
    exports: [TweetsService]
})
export class TweetsModule {}
