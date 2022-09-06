import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
import { AddTweetDto } from "./dto/add-tweet.dto";
import { GetTweetsQueryDto } from "./dto/get-tweets.dto";
import { Tweet } from "./tweets.entity";

@Injectable()
export class TweetsService {
    constructor(@InjectRepository(Tweet) private tweetRepository: Repository<Tweet>) {}


    async getAllTweets(query: GetTweetsQueryDto): Promise<Tweet[]> {
        // return await this.tweetRepository.find({ 
        //     where: { author: { id: query.authorId} }, 
        //     order: { createdAt: 'DESC'},
        //     relations: ['origTweet']
        // })
        const qb = this.tweetRepository.createQueryBuilder('tweets')
            .leftJoinAndSelect('tweets.author', 'author')
            .leftJoinAndSelect('tweets.origTweet', 'origTweet')
            .addSelect('origTweet.author')
            .leftJoinAndSelect('origTweet.author', 'origTweetAuthor')
            .leftJoinAndSelect('tweets.replyTo', 'replyTo')
            .addSelect('replyTo.author')
            .leftJoinAndSelect('replyTo.author', 'replyToAuthor')

        if(query.authorId && query.hashtags) {
            qb.where(`tweets.author = :authorId`, { authorId: query.authorId })
            .andWhere('tweets.hashtags IN (:hashtags)', { hashtags: query.hashtags })
        } else if(query.authorId){
            qb.where(`tweets.author = :authorId`, { authorId: query.authorId })
        } else if(query.hashtags && query.hashtags.length > 0){
            qb.where('tweets.hashtags IN (:hashtags)', { hashtags: query.hashtags })
        }
        return qb
            .addSelect('tweets.created_at')
            .orderBy('tweets.created_at', 'DESC')
            .getMany();
    }

    async getTweetById(tweetId: number): Promise<Tweet> {
        return await this.tweetRepository.createQueryBuilder('tweet')
            .leftJoinAndSelect('tweet.author', 'author')
            .where(`tweet.id = :tweetId`, { tweetId })
            .getOne();
    }

    async updateTweetLike(tweet: Tweet, count: number) {
        tweet.likeCount = count;
        return await this.tweetRepository.save(tweet);
    }

    async addTweet(tweet: AddTweetDto, author: User, origTweetId: number, replyToId: number): Promise<Tweet> {
        if(origTweetId && replyToId){
            throw new BadRequestException('Tweet can be either Reply or Retweet');
        }

        const newTweet = new Tweet();
        newTweet.tweet = tweet.tweet;
        newTweet.author = author;

        if(tweet.hashtags && tweet.hashtags.length > 0){
            newTweet.hashtags = tweet.hashtags;
        }

        if(origTweetId) {
            const origTweet = await this.tweetRepository.findOneBy({ id: origTweetId })
            if(!origTweet){
                throw new NotFoundException('Original Tweet not found')
            }
            origTweet.retweetCount += 1;
            await this.tweetRepository.save(origTweet)
            newTweet.origTweet = origTweet;
        }

        if(replyToId) {
            const replyToTweet = await this.tweetRepository.findOneBy({ id: replyToId });
            if(!replyToTweet){
                throw new NotFoundException('Original Tweet not found')
            }
            newTweet.replyTo = replyToTweet;
        }

        const savedTweet = await this.tweetRepository.save(newTweet);
        return savedTweet;
    }

    async deleteTweet(tweet: Tweet) {
        return await this.tweetRepository.remove(tweet);
    }
}