import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tweet } from "src/tweets/tweets.entity";
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
import { Like } from "./likes.entity";

@Injectable()
export class LikesService {
    constructor(@InjectRepository(Like) private likeRepository: Repository<Like>) {}

    private async getLike(tweetId: number, userId: number): Promise<Like> {
        return await this.likeRepository.createQueryBuilder('likes')
            .leftJoinAndSelect('likes.tweet', 'tweet')
            .leftJoinAndSelect('likes.user', 'user')
            .where(`tweet.id = :tweetId`, { tweetId })
            .andWhere(`user.id = :userId`, { userId })
            .getOne();
    }

    async likeTweet(tweet: Tweet, user: User): Promise<boolean> {
        const alreadyLiked = await this.getLike(tweet.id, user.id);

        if(alreadyLiked) {
            return false;
        }

        const newLike = new Like();
        newLike.tweet = tweet;
        newLike.user = user;
        const savedLike = await this.likeRepository.save(newLike);
        return savedLike !== null;
    }

    async unlikeTweet(tweet: Tweet, user: User): Promise<boolean> {
        const likedTweet = await this.getLike(tweet.id, user.id);
        if(!likedTweet) {
            return false;
        }
        const unlikeTweet = await this.likeRepository.delete(likedTweet.id);
        return unlikeTweet.affected === 1;
    }
}