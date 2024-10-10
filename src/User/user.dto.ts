import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsNotEmpty({ message: 'username is required' })
    username: string;

    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'invalid email address' })
    email: string;

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