import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import {
    AdminLoginDto, AdminUpdateUserDto, ChangeAdminPasswordDto, RegisterAdminDto,
    ResendAdminOtpDto, ResetAdminPasswordDto, ResetAdminPasswordLinkDto, UpdateAdminDto,
    VerifyAdminOtpDto
} from './admin.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { AdminRolesGuard } from 'src/auth/guard/admin.role.guard';
import { Roles } from 'src/auth/decorators.ts/role.decorators';
import { Role } from 'src/Enum/general.enum';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminservice: AdminService) { }

    @Post('/register')
    @ApiCreatedResponse({ description: 'new admin registered'})
    @ApiBadRequestResponse({ description: 'admin not registered'})
    async registerAdmin(@Body() dto: RegisterAdminDto) {
        return await this.adminservice.registerAdmin(dto)
    }

    @Post('/verify')
    @ApiCreatedResponse({ description: 'code verified'})
    @ApiBadRequestResponse({ description: 'code not verified'})
    async verfifyAdmincode(@Body() dto: VerifyAdminOtpDto) {
        return await this.adminservice.verifyCode(dto)
    }

    @Post('/resend')
    @ApiCreatedResponse({ description: 'new code sent'})
    @ApiBadRequestResponse({ description: 'code not sent'})
    async resendCode(@Body() dto: ResendAdminOtpDto) {
        return await this.adminservice.resendVerification(dto)
    }

    @Post('/reset-password-link')
      @ApiCreatedResponse({ description: 'reset link sent'})
    @ApiBadRequestResponse({ description: 'reset link not sent'})
    async resetPasswordLink(@Body() dto: ResetAdminPasswordLinkDto) {
        return await this.adminservice.resetAdminPasswordLink(dto)
    }

    @Post('/reset-password')
    @ApiCreatedResponse({ description: 'password reset successfully'})
    @ApiBadRequestResponse({ description: 'invalid reset link'})
    async resetPassword(@Body() dto: ResetAdminPasswordDto) {
        return await this.adminservice.resetAdminPassword(dto)
    }

    @Post('/login')
    @ApiCreatedResponse({ description: 'login successful'})
    @ApiBadRequestResponse({ description: 'login failed'})
    async login(@Body() dto: AdminLoginDto) {
        return await this.adminservice.adminLogin(dto)
    }


    @UseGuards(AdminRolesGuard)
    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard)
    @Put('/update/:id')
    @ApiCreatedResponse({ description: 'admin profile update'})
    @ApiBadRequestResponse({ description: 'no changes made'})
    async updateAdmin(@Param('id') id: number, @Body() dto: UpdateAdminDto) {
        return await this.adminservice.updateAdmin(id, dto)
    }

    @UseGuards(AdminRolesGuard)
    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard)
    @Delete('/delete/:id')
    @ApiCreatedResponse({ description: 'admin profile deleted'})
    @ApiBadRequestResponse({ description: 'profile not deleted'})
    async deleteAdmin(@Param('id') id: number) {
        return await this.adminservice.deleteAdmin(id)
    }

    @UseGuards(AdminRolesGuard)
    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard)
    @Patch('/change/:id')
    @ApiCreatedResponse({ description: 'admin password changed'})
    @ApiBadRequestResponse({ description: 'cannot change password'})
    async changePassword(@Param('id') id: number, @Body() dto: ChangeAdminPasswordDto) {
        return await this.adminservice.changeAdminPassword(id, dto)
    }

    @UseGuards(AdminRolesGuard)
    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard)
    @Put('/update-user/:adminId/:userId')
    @ApiCreatedResponse({ description: 'user profile updated by admin'})
    @ApiBadRequestResponse({ description: 'not updated'})
    async updateUser(@Param('adminId') adminId: number, @Param('userId') userId: number, @Body() dto: AdminUpdateUserDto) {
        return await this.adminservice.adminUpdateUser(adminId, userId, dto)
    }

    @UseGuards(AdminRolesGuard)
    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard)
    @Delete('/delete-user/:adminId/:userId')
    @ApiCreatedResponse({ description: 'user profile deleted by admin'})
    @ApiBadRequestResponse({ description: 'not deleted'})
    async deleteUser(@Param('adminId') adminId: number, @Param('userId') userId: number) {
        return await this.adminservice.adminDelete(adminId, userId)
    }

    @UseGuards(AdminRolesGuard)
    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard)
    @Post('/send-mail/:id')
    @ApiCreatedResponse({ description: 'mail sent to users by admin'})
    @ApiBadRequestResponse({ description: 'mail not sent'})
    async sendMailToUsers(@Param('id') id: number) {
        return await this.adminservice.adminSendMail(id)
    }

    @UseGuards(AdminRolesGuard)
    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard)
    @Get('/get-users/:id')
    @ApiCreatedResponse({ description: 'get all users'})
    @ApiBadRequestResponse({ description: 'no user'})
    async getAllUser(@Param('id') id: number) {
        return await this.adminservice.allUsers(id)
    }

    @UseGuards(AdminRolesGuard)
    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard)
    @Get('/get-one/:adminId/:userId')
    @ApiCreatedResponse({ description: 'user profile '})
    @ApiBadRequestResponse({ description: 'wrong user'})
    async getOne(@Param('adminId') adminId: number, @Param('userId') userId: number) {
        return await this.adminservice.getOneUser(adminId, userId)
    }
} 
