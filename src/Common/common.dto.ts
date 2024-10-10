import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"
import exp from "constants";

//verify user
export class VerifyOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    otp: string
}

//resend verificaton code
export class ResendUserOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
}

//reset password link
export class ResetPasswordLinkOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

//reset user password
export class ResetPasswordOtpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    resetLink: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string;
}

//change user password 
export class ChangeUserPasswordDto {
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase:1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    oldPassword: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase:1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    newPassword: string
}

//update user profile
export class UpdateUserDto {
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsNotEmpty({ message: 'username is required' })
    username: string;

    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'invalid email address' })
    email: string;

}

//login dto
export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string;
}