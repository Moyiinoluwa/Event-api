import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class RegisterAdminDto {
    @ApiProperty({  description: 'name of the admin', example: 'max' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({ description: 'email of the admin',  example: 'max@gmail.com'})
    @IsNotEmpty()
    @IsEmail({}, { message: 'invalid email address' })
    email: string

    @ApiProperty({  description: 'password of the admin',  example: 'Machine1@' })
    @IsNotEmpty({ message: 'Password is required' })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string;
}

//verify code
export class VerifyAdminOtpDto {
    @ApiProperty({ description: 'email of the registered admin',  example: 'max@gmail.com' })
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'email is  invalid' })
    email: string;

    @ApiProperty({ description: 'code that was sent to the admin email',  example: '926481'  })
    @IsNotEmpty()
    otp: string;
}

//resend code
export class ResendAdminOtpDto {
    @ApiProperty({ description: 'email of the registered admin', example: 'max@gmail.com'})
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'email is  invalid' })
    email: string;
}

//send reset link
export class ResetAdminPasswordLinkDto {
    @ApiProperty({ description: 'email of the registered admin',  example: 'max@gmail.com'  })
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'invalid email' })
    email: string
}

//reset password
export class ResetAdminPasswordDto {
    @ApiProperty({ description: 'email of the registered admin', example: 'max@gmail.com' })
    @IsEmail({}, { message: 'invalid email' })
    @IsNotEmpty({ message: 'email is required' })
    email: string

    @ApiProperty({ description: 'reset link that was sent to the admin mail', example: 'link'})
    @IsNotEmpty({ message: 'link is required' })
    resetLink: string

    @ApiProperty({ description: 'set a new password', example: 'max@gmail.com' })
    @IsNotEmpty({ message: 'password is required' })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: string
}

//admin login
export class AdminLoginDto {
    @ApiProperty({ description: 'email of the registered admin',  example: 'max@gmail.com' })
    @IsEmail({}, { message: 'email is invalid' })
    @IsNotEmpty({ message: 'email is required' })
    email: string

    @ApiProperty({ description: 'password of a regsitered admin',  example: 'Password2!' })
    @IsNotEmpty({ message: 'password is required' })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password: any
}

export class UpdateAdminDto {
    @ApiProperty({ description: 'name of the admin', example: 'bels' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({ description: 'email of the registered admin', example: 'max@gmail.com' })
    @IsNotEmpty()
    @IsEmail({}, { message: 'invalid email address' })
    email: string

}

//change password dto
export class ChangeAdminPasswordDto {
    @ApiProperty({ description: 'admin password',  example: 'Password2!' })
    @IsNotEmpty({ message: 'old password is required' })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    oldPassword: string;

    @ApiProperty({ description: 'new password', example: 'Password12&' })
    @IsNotEmpty({ message: 'new password is required' })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    newPassword: string;
}

//admin update user dto
export class AdminUpdateUserDto {
    @ApiProperty({ description: 'admin update user email', example: 'max@gmail.com' })
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @ApiProperty({ description: 'admin update user name',  example: 'maaxx' })
    @IsNotEmpty({ message: 'username is required' })
    username: string;
}

//admin send mail to users
// export class SendMailToUsers {
//     @IsNotEmpty({ message: 'email is required' })
//     @IsEmail({}, { message: 'invalid email address' })
//     email: string;
// }

