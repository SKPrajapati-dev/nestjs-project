import { Transform, Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString } from "class-validator";

export class GetTweetsQueryDto {
    
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    authorId?: number;

    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    @Transform(({ value }) => value.split(','))
    hashtags?: string[];
}