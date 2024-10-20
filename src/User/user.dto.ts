import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class RegisterUserDto {
    @ApiProperty({  description: 'name of the user',  example: 'max' })
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @ApiProperty({  description: 'username of the user',  example: 'max1' })
    @IsNotEmpty({ message: 'username is required' })
    username: string;

    @ApiProperty({ description: 'email of the user',  example: 'max@gmail.com' })
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'invalid email address' })
    email: string;

    @ApiProperty({ description: 'password of the user',  example: 'Password1@' })
    @IsNotEmpty({ message: 'password is required'})
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string;

}