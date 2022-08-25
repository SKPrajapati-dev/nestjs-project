import { TwtrBaseEntity } from "src/common/base.entity";
import { BeforeInsert, Column, Entity } from "typeorm";

@Entity()
export class User extends TwtrBaseEntity{
    @Column({ length: 30, nullable: false, unique: true })
    username: string;

    @Column({ nullable: true, length: 50 })
    name: string;

    @Column({ nullable: true, length: 240 })
    bio?: string;

    @Column({ nullable: false })
    password?: string;

    static removePassword(userObj: User) {
        return Object.fromEntries(
            Object.entries(userObj).filter(([key, val]) => key !== 'password')
        );
    }
}