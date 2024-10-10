import { Body, Controller, Delete, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './user.dto';
import { ChangeUserPasswordDto, LoginDto, ResendUserOtpDto, ResetPasswordLinkOtpDto,
     ResetPasswordOtpDto, UpdateUserDto, VerifyOtpDto } from 'src/Common/common.dto';

@Controller('user')
export class UserController {
    constructor (private userservice: UserService) {}

    //user registration
    @Post('/register') 
    async register(@Body() dto: RegisterUserDto) {
        return await this.userservice.registerUser(dto)

    }

    //code verification
    @Post('/verify-code')
    async verifyOtp (@Body() dto: VerifyOtpDto) {
        return await this.userservice.verifyOtp(dto)
    }

    //resend verification code
    @Post('/resend-code')
    async resendOtp(@Body() dto: ResendUserOtpDto) {
        return await this.userservice.resendOtp(dto)
    }

    //send reset password link
    @Post('/reset-password-link')
    async resetPasswordLink(@Body() dto: ResetPasswordLinkOtpDto)  {
        return await this.userservice.resetPasswordLink(dto)
    }

    //reset password after getting the link
    @Post('/reset-password')
    async resetPassword(@Body() dto: ResetPasswordOtpDto) {
        return await this.userservice.resetPassword(dto)
    }

    //user login
    @Post('/login')
    async userLogin(@Body() dto: LoginDto) {
        return await this.userservice.userLogin(dto)
    }
    
    //change user password
    @Patch('/change/:id')
    async changePassword(@Param('id') id: number, @Body() dto: ChangeUserPasswordDto) {
        return await this.userservice.changePassword(id, dto)
    }

    //update user profile
    @Put('update/:id')
    async updatePassword(@Param('id') id: number, @Body() dto: UpdateUserDto) {
        return await this.userservice.updateProfile(id, dto)
    }

    //delete user
    @Delete('delete/:id') 
    async deleteUser(@Param('id') id: number) {
        return await this.userservice.deleteUser(id)
    }
}
