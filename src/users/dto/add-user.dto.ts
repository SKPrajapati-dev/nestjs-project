export class AddUserDto {
    readonly username: string;
    readonly name: string;
    password: string;
    readonly bio?: string;
}