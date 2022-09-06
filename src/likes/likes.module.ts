import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from 'src/tweets/tweets.entity';
import { TweetsModule } from 'src/tweets/tweets.module';
import { UsersModule } from 'src/users/users.module';
import { LikesController } from './likes.controller';
import { Like } from './likes.entity';
import { LikesService } from './likes.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Tweet, Like]),
        TweetsModule,
        UsersModule
    ],
    controllers: [LikesController],
    providers: [LikesService]
})
export class LikesModule {}
