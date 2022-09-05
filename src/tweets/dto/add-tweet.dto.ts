import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

export class AddTweetDto {
    tweet: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    hashtags?: string[];

    @IsOptional()
    origTweetId?: number;

    @IsOptional()
    replyToId?: number;
}