import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class RegisterAdminDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'invalid email address' })
    email: string

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
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'email is  invalid' })
    email: string;

    @IsNotEmpty()
    otp: string;
}

//resend code
export class ResendAdminOtpDto {
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'email is  invalid' })
    email: string;
}

//send reset link
export class ResetAdminPasswordLinkDto {
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'invalid email' })
    email: string
}

//reset password
export class ResetAdminPasswordDto {
    @IsEmail({}, { message: 'invalid email' })
    @IsNotEmpty({ message: 'email is required' })
    email: string


    @IsNotEmpty({ message: 'link is required' })
    resetLink: string

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
    @IsEmail({}, { message: 'email is invalid' })
    @IsNotEmpty({ message: 'email is required' })
    email: string

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
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'invalid email address' })
    email: string

}

//change password dto
export class ChangeAdminPasswordDto {
    @IsNotEmpty({ message: 'old password is required' })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    oldPassword: string;

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
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsNotEmpty({ message: 'username is required' })
    username: string;
}

//admin send mail to users
export class SendMailToUsers {
    @IsNotEmpty({ message: 'email is required' })
    @IsEmail({}, { message: 'invalid email address' })
    email: string;
}

