import { TwtrBaseEntity } from "src/common/base.entity";
import { Tweet } from "src/tweets/tweets.entity";
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";

@Entity({ name: 'users'})
export class User extends TwtrBaseEntity{
    @Column({ length: 30, nullable: false, unique: true })
    username: string;

    @Column({ nullable: true, length: 50 })
    name: string;

    @Column({ nullable: true, length: 240 })
    bio?: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    provider?: string;

    @Column({ name: 'provider_id', nullable: true })
    providerId?: string;


    @OneToMany(() => Tweet, tweet => tweet.author)
    tweets: Tweet[];

    static removePassword(userObj: User) {
        return Object.fromEntries(
            Object.entries(userObj).filter(([key, val]) => key !== 'password')
        );
    }
}