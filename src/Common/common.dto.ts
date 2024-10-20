import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"


//verify user
export class VerifyOtpDto {
    @ApiProperty({  description: 'email of the registered user', example: 'max@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        description: 'code sent to the user email',  example: '297810' })
    @IsNotEmpty()
    otp: string
}

//resend verificaton code
export class ResendUserOtpDto {
    @ApiProperty({ description: 'email of the registered user',  example: 'max@gmail.com'  })
    @IsNotEmpty()
    @IsEmail()
    email: string
}

//reset password link
export class ResetPasswordLinkOtpDto {
    @ApiProperty({ description: 'email of the registered user', example: 'max@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

//reset user password
export class ResetPasswordOtpDto {
    @ApiProperty({ description: 'email of the registered user', example: 'max@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'link sent to the user email',  example: 'link' })
    @IsNotEmpty()
    resetLink: string;

    @ApiProperty({ description: ' set a new password',  example: 'Captain10$'})
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
    @ApiProperty({ description: 'user password',  example: 'Captain10#'  })
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase:1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    oldPassword: string;

    @ApiProperty({ description: 'user new password', example: 'Captain1%' })
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
    @ApiProperty({ description: 'name of the user', example: 'mark' })
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @ApiProperty({ description: 'username of the user',  example: 'mark10' })
    @IsNotEmpty({ message: 'username is required' })
    username: string;

    @ApiProperty({ description: 'user email',  example: 'mark@gmail.com'  })
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'invalid email address' })
    email: string;

}

//login dto
export class LoginDto {
    @ApiProperty({  description: 'user email',  example: 'mark@gmail.com'  })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'user password', example: 'Captain10' })
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