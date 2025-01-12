import { IsEmail, IsString, MinLength } from "class-validator"

export class SignUpDto {
    @IsEmail()
    email: string

    @IsString()
    username: string

    @IsString()
    @MinLength(4)
    password: string
}