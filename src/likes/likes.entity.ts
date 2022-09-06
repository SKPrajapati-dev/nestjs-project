import { TwtrBaseEntity } from "src/common/base.entity";
import { Tweet } from "src/tweets/tweets.entity";
import { User } from "src/users/users.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'likes' })
export class Like extends TwtrBaseEntity {
    @ManyToOne(() => Tweet, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tweet_id' })
    tweet: Tweet;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}