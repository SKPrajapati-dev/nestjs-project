import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Query, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
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

    @UseGuards(AuthenticatedGuard)
    @Delete('/:tweet_id')
    async deleteTweet(@Param('tweet_id', ParseIntPipe) tweetId: number, @Request() req) {
        const tweet = await this.tweetService.getTweetById(tweetId);
        if(!tweet){
            throw new NotFoundException('Tweet not found!.')
        }

        if(req.user.id == tweet.author.id) {
            return await this.tweetService.deleteTweet(tweet);
        } else {
            throw new UnauthorizedException('You are not authorized to delete this tweet')
        }
    }
}