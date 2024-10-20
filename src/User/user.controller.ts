import { Body, Controller, Delete, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './user.dto';
import { 
    ChangeUserPasswordDto, LoginDto, ResendUserOtpDto, ResetPasswordLinkOtpDto,
    ResetPasswordOtpDto, UpdateUserDto, VerifyOtpDto
} from 'src/Common/common.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private userservice: UserService) { }

    //user registration
    @ApiCreatedResponse({ description: 'user registered'})
    @ApiBadRequestResponse({ description: 'user not registered'})
    @Post('/register')
    async register(@Body() dto: RegisterUserDto) {
        return await this.userservice.registerUser(dto)

    }

    //code verification
    @ApiCreatedResponse({ description: 'code verified'})
    @ApiBadRequestResponse({ description: 'code not verified'})
    @Post('/verify-code')
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        return await this.userservice.verifyOtp(dto)
    }

    //resend verification code
    @ApiCreatedResponse({ description: 'code resent'})
    @ApiBadRequestResponse({ description: 'new code not sent'})
    @Post('/resend-code')
    async resendOtp(@Body() dto: ResendUserOtpDto) {
        return await this.userservice.resendOtp(dto)
    }

    //send reset password link
    @ApiCreatedResponse({ description: 'reset link sent'})
    @ApiBadRequestResponse({ description: 'reset link not sent'})
    @Post('/reset-password-link')
    async resetPasswordLink(@Body() dto: ResetPasswordLinkOtpDto) {
        return await this.userservice.resetPasswordLink(dto)
    }

    //reset password after getting the link
    @ApiCreatedResponse({ description: 'password reset '})
    @ApiBadRequestResponse({ description: 'invalid link'})
    @Post('/reset-password')
    async resetPassword(@Body() dto: ResetPasswordOtpDto) {
        return await this.userservice.resetPassword(dto)
    }

    //user login
    @ApiCreatedResponse({ description: 'user login'})
    @ApiBadRequestResponse({ description: 'error'})
    @Post('/login')
    async userLogin(@Body() dto: LoginDto) {
        return await this.userservice.userLogin(dto)
    }

    //change user password
    @ApiCreatedResponse({ description: 'password changed'})
    @ApiBadRequestResponse({ description: 'password not changed'})
    @Patch('/change/:id')
    async changePassword(@Param('id') id: number, @Body() dto: ChangeUserPasswordDto) {
        return await this.userservice.changePassword(id, dto)
    }

    //update user profile
    @ApiCreatedResponse({ description: 'user profile updated'})
    @ApiBadRequestResponse({ description: 'profile not updated'})
    @Put('update/:id')
    async updatePassword(@Param('id') id: number, @Body() dto: UpdateUserDto) {
        return await this.userservice.updateProfile(id, dto)
    }

    //delete user
    @ApiCreatedResponse({ description: 'user profile deleted'})
    @ApiBadRequestResponse({ description: 'not deleted'})
    @Delete('delete/:id')
    async deleteUser(@Param('id') id: number) {
        return await this.userservice.deleteUser(id)
    }
}
