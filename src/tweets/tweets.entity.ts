import { TwtrBaseEntity } from "src/common/base.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity({ name: 'tweets'})
export class Tweet extends TwtrBaseEntity{
    @Column({ length: 250, nullable: true })
    tweet: string;

    @ManyToOne(() => User, user => user.tweets)
    @JoinColumn({ name: 'author_id'})
    author: User;

    @Column('text', { array: true, nullable: true })
    media: string[];

    @Column({ name: 'like_count', default: 0 })
    likeCount: number;

    @Column({ name: 'retweet_count', default: 0 })
    retweetCount: number;

    @Column('text', { array: true, nullable: true  })
    hashtags: string[];

    @OneToOne(() => Tweet)
    @JoinColumn({ name: 'orig_tweet_id' })
    origTweet: Tweet;

    @OneToOne(() => Tweet)
    @JoinColumn({ name: 'reply_to_id' })
    replyTo: Tweet;
}