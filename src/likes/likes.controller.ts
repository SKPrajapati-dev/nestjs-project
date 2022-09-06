import { Controller, Delete, NotFoundException, Param, ParseIntPipe, Put, Request, UseGuards } from "@nestjs/common";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { TweetsService } from "src/tweets/tweets.service";
import { UsersService } from "src/users/users.service";
import { LikesService } from "./likes.service";

@Controller('like')
export class LikesController {
    constructor(
        private likesService: LikesService,
        private userService: UsersService, 
        private tweetsService: TweetsService
    ) {}

    @UseGuards(AuthenticatedGuard)
    @Put('/:tweet_id')
    async likeTweet(@Param('tweet_id', ParseIntPipe) tweetId: number, @Request() req): Promise<boolean> {
        const user = await this.userService.getUserByUserId(req.user.id);
        const tweet = await this.tweetsService.getTweetById(tweetId);
        if(!tweet) {
            throw new NotFoundException('Tweet not found!')
        }
        const like = await this.likesService.likeTweet(tweet, user);
        if(like) {
            await this.tweetsService.updateTweetLike(tweet, tweet.likeCount+1);
            return true;
        }
        return false;
    }

    @UseGuards(AuthenticatedGuard)
    @Delete('/:tweet_id')
    async unlikeTweet(@Param('tweet_id', ParseIntPipe) tweetId: number, @Request() req) {
        const user = await this.userService.getUserByUserId(req.user.id);
        const tweet = await this.tweetsService.getTweetById(tweetId);
        if(!tweet) {
            throw new NotFoundException('Tweet not found!.')
        }
        const unlike = await this.likesService.unlikeTweet(tweet, user);
        if(unlike) {
            await this.tweetsService.updateTweetLike(tweet, tweet.likeCount-1)
            return true;
        }
        return false;
    }
}