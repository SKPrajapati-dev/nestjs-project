import { BadRequestException, Body, Controller, Get, Post, Query, Request, UseGuards } from "@nestjs/common";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { UsersService } from "src/users/users.service";
import { AddTweetDto } from "./dto/add-tweet.dto";
import { GetTweetsQueryDto } from "./dto/get-tweets.dto";
import { Tweet } from "./tweets.entity";
import { TweetsService } from "./tweets.service";

@Controller('tweets')
export class TweetsController {
    constructor(
        private usersService: UsersService,
        private tweetService: TweetsService
    ) {}

    @Get('/')
    async getAllTweets(@Query() query: GetTweetsQueryDto): Promise<any> {
        if(!query.authorId && !query.hashtags) {
            throw new BadRequestException('Please Provide authorid or hashtags')
        }
        return await this.tweetService.getAllTweets(query)
    }

    @UseGuards(AuthenticatedGuard)
    @Post('/')
    async addTweet(@Body() newTweet: AddTweetDto, @Request() req): Promise<Tweet> {
        const author = await this.usersService.getUserByUserId(req.user.id);
        return await this.tweetService.addTweet(newTweet, author, newTweet.origTweetId, newTweet.replyToId);
    }
}