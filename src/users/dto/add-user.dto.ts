import { IsOptional, IsString } from "class-validator";

export class AddUserDto {
    @IsString()
    username: string;

    @IsString()
    name: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    bio?: string;
}