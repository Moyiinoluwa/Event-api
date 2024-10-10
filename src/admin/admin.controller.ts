import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import {
    AdminLoginDto, AdminUpdateUserDto, ChangeAdminPasswordDto, RegisterAdminDto,
    ResendAdminOtpDto, ResetAdminPasswordDto, ResetAdminPasswordLinkDto, UpdateAdminDto,
    VerifyAdminOtpDto
} from './admin.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators.ts/role.decorators';
import { Role } from 'src/Enum/general.enum';


@UseGuards(JwtGuard)

@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminservice: AdminService) { }

    @Post('/register')
    async registerAdmin(@Body() dto: RegisterAdminDto) {
        return await this.adminservice.registerAdmin(dto)
    }

    @Post('/verify')
    async verfifyAdmincode(@Body() dto: VerifyAdminOtpDto) {
        return await this.adminservice.verifyCode(dto)
    }

    @Post('/resend')
    async resendCode(@Body() dto: ResendAdminOtpDto) {
        return await this.adminservice.resendVerification(dto)
    }

    @Post('/reset-password-link')
    async resetPasswordLink(@Body() dto: ResetAdminPasswordLinkDto) {
        return await this.adminservice.resetAdminPasswordLink(dto)
    }

    @Post('/reset-password')
    async resetPassword(@Body() dto: ResetAdminPasswordDto) {
        return await this.adminservice.resetAdminPassword(dto)
    }

    @Post('/login')
    async login(@Body() dto: AdminLoginDto) {
        return await this.adminservice.adminLogin(dto)
    }

    @Put('/update/:id')
    async updateAdmin(@Param('id') id: number, @Body() dto: UpdateAdminDto) {
        return await this.adminservice.updateAdmin(id, dto)
    }

    @Delete('/delete/:id')
    async deleteAdmin(@Param('id') id: number) {
        return await this.adminservice.deleteAdmin(id)
    }

    @Patch('/change/:id')
    async changePassword(@Param('id') id: number, @Body() dto: ChangeAdminPasswordDto) {
        return await this.adminservice.changeAdminPassword(id, dto)
    }

    @Put('/update-user/:adminId/:userId')
    async updateUser(@Param('adminId') adminId: number, @Param('userId') userId: number, @Body() dto: AdminUpdateUserDto) {
        return await this.adminservice.adminUpdateUser(adminId, userId, dto)
    }

    @Delete('/delete-user/:adminId/:userId')
    async deleteUser(@Param('adminId') adminId: number, @Param('userId') userId: number) {
        return await this.adminservice.adminDelete(adminId, userId)
    }

    @Post('/send-mail/:id')
    async sendMailToUsers(@Param('id') id: number) {
        return await this.adminservice.adminSendMail(id)
    }

    @Get('/get-users/:id')
    async getAllUser(@Param('id') id: number) {
        return await this.adminservice.allUsers(id)
    }

    @Get('/get-one/:id/:id')
    async getOne(@Param('adminId') adminId: number, @Param('userId') userId: number) {
        return await this.adminservice.getOneUser(adminId, userId)
    }
} 
