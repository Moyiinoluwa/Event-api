import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from './admin.repository';
import { AdminOtpRepository } from 'src/Common/common.repository';
import {
    AdminLoginDto, AdminUpdateUserDto, ChangeAdminPasswordDto, RegisterAdminDto,
    ResendAdminOtpDto, ResetAdminPasswordDto, ResetAdminPasswordLinkDto,
    SendMailToUsers, UpdateAdminDto, VerifyAdminOtpDto
} from './admin.dto';
import * as bcrypt from 'bcrypt'
import { AdminEntity } from 'src/Entity/admin.entity';
import { customAlphabet } from 'nanoid';
import { AdminOtpEntity } from 'src/Entity/adminOtp.entity';
import { Mailer } from 'src/Mailer/mailer.service';
import { LessThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/user.repository';
import { UserEntity } from 'src/Entity/user.entity';



@Injectable()
export class AdminService {
    constructor(@InjectRepository(AdminRepository) private readonly adminrepository: AdminRepository,
        @InjectRepository(AdminOtpRepository) private readonly adminotprepository: AdminOtpRepository,
        @InjectRepository(UserRepository) private readonly userrepository: UserRepository,
        private readonly mailer: Mailer,
        private jwt: JwtService,
        private configservice: ConfigService) { }

    //hash password for registration
    async hashPassword(password: any) {
        return await bcrypt.hash(password, 12)
    }

    //compare password for login access
    async comparePassword(oldPassword: any, newPassword: any) {
        return await bcrypt.compare(oldPassword, newPassword)
    }

    //set verification code
    async verificationCode() {
        const verify = customAlphabet('012345789', 6)
        return verify();
    }

    //Generate Access token
    async setToken(id: number, email: string, role: string) {
        const payload = {
            sub: id,
            email,
            role
        }

        const secret = this.configservice.get('SECRET_KEY')
        const token = await this.jwt.signAsync(payload, {
            expiresIn: this.configservice.get('EXPIRESIN'),
            secret: secret
        });

        return { accessToken: token }
    }

    //REGISTER ADMIN
    async registerAdmin(dto: RegisterAdminDto): Promise<{ message: string }> {
        //check if admin has registered before
        const admin = await this.adminrepository.findOne({ where: { email: dto.email } })
        if (admin) {
            throw new BadRequestException('Admin already registered')
        }

        //hash password
        const hash = await this.hashPassword(dto.password)

        //create new admin
        const addmin = new AdminEntity()
        addmin.email = dto.email;
        addmin.name = dto.name;
        addmin.password = hash;
        addmin.createdAt = new Date();

        //save to database
        await this.adminrepository.save(addmin)

        //set verification code
        const adminCode = await this.verificationCode();

        //expiration time for verification code
        const adminTime = new Date();
        adminTime.setMinutes(adminTime.getMinutes() + 10);

        //save verification code to database
        const adminOtp = new AdminOtpEntity();
        adminOtp.email = dto.email;
        adminOtp.otp = adminCode;
        adminOtp.expirationTime = adminTime;
        adminOtp.createdAt = new Date();

        await this.adminotprepository.save(adminOtp)

        //send verification to admin via mail
        await this.mailer.verificationMail(dto.email, adminCode, dto.name)

        return { message: 'Admin registered' }
    }


    //VERIFY VERIFICATION CODE
    async verifyCode(dto: VerifyAdminOtpDto): Promise<{ message: string }> {

        //check if the email and code is correct
        const adminCode = await this.adminotprepository.findOne({ where: { email: dto.email, otp: dto.otp } })
        if (!adminCode) {
            throw new BadRequestException('The code or email is not correct')
        }

        //check if code has expired
        if (adminCode.expirationTime <= new Date()) {
            throw new BadRequestException('the code has expired')
        }

        //find the admin associated with the email
        const admin = await this.adminrepository.findOne({ where: { email: dto.email } })
        if (!admin) {
            throw new BadRequestException('admin is not registered')
        }

        //update verification status
        adminCode.verified = true;

        //save to database
        await this.adminotprepository.save(adminCode)

        return { message: 'admin code verified' }
    }


    //RESEND VERIFICATION CODE
    async resendVerification(dto: ResendAdminOtpDto): Promise<{ message: string }> {

        //check if email is registered
        const admin = await this.adminrepository.findOne({ where: { email: dto.email } })
        if (!admin) {
            throw new BadRequestException('admin cannot request for new otp')
        }

        //check if previous code has expired
        const previous = await this.adminotprepository.findOne({ where: { otp: dto.email, expirationTime: LessThan(new Date()) } })
        if (previous) {
            throw new BadRequestException(' the previous otp has not expired')
        }

        //set the code
        const admincode = await this.verificationCode();

        //set expiration time
        const time = new Date();
        time.setMinutes(time.getMinutes() + 10);

        //save the code to database
        const newCode = new AdminOtpEntity();
        newCode.email = dto.email;
        newCode.expirationTime = new Date();
        newCode.otp = admincode;
        newCode.createdAt = new Date();

        //resend the code via mail
        await this.mailer.verificationMail(dto.email, admincode, admin.name)

        return { message: 'verification code reset' }
    }

    //RESET PASSWORD LINK
    async resetAdminPasswordLink(dto: ResetAdminPasswordLinkDto): Promise<{ message: string }> {

        //check if user is registered
        const admin = await this.adminrepository.findOne({ where: { email: dto.email } })
        if (!admin) {
            throw new BadRequestException('admin cannot get reset link')
        }

        //get the reset token
        const getLink = uuidv4();

        //set the link
        const resetLink = `http://localhost:3000/admin/reset-password?${getLink}`

        //set expiration time for reset link
        const linkTime = new Date();
        linkTime.setMinutes(linkTime.getMinutes() + 10)

        //update profile
        admin.resetLink = resetLink;
        admin.isResetLinkSent = true;
        admin.resetLinkExiprationTime = new Date();

        //send reset link to admin via mail
        await this.mailer.resetPasswordMail(dto.email, resetLink, admin.name)

        //save to database
        await this.adminrepository.save(admin)

        return { message: 'reset link sent' }
    }


    //RESET PASSWORD
    async resetAdminPassword(dto: ResetAdminPasswordDto): Promise<{ message: string }> {

        //check if user is registered
        const admin = await this.adminrepository.findOne({ where: { email: dto.email } })
        if (!admin) {
            throw new BadRequestException('admin cannot reset password')
        }

        //check if link is valid
        if (admin.resetLink !== dto.resetLink) {
            throw new BadRequestException('invalid link')
        }

        //hash password
        const hash = await this.hashPassword(dto.password)

        //update profile
        admin.password = hash;

        //save to database
        await this.adminrepository.save(admin)

        return { message: 'password reset' }
    }


    // LOGIN
    async adminLogin(dto: AdminLoginDto) {
        // Check if the admin is registered
        const admin = await this.adminrepository.findOne({ where: { email: dto.email } });
        if (!admin) {
            throw new UnauthorizedException('Admin not registered');
        }

        // Compare the password
        const isPasswordValid = await this.comparePassword(dto.password, admin.password);

        if (!isPasswordValid) {
            // Increment login count if the password is incorrect
            admin.loginCount += 1;

            // Check if the admin has exceeded login attempts
            if (admin.loginCount >= 5) {
                admin.isLocked = true;
                admin.lockedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // Lock for two hours
                await this.adminrepository.save(admin); // Save the changes before throwing exception
                throw new BadRequestException('Wrong password entered. Account locked.');
            }

            // Save the incremented loginCount
            await this.adminrepository.save(admin);
            throw new UnauthorizedException('Invalid password');
        }

        // If password matches, reset login count and unlock the admin if previously locked
        admin.isLoggedIn = true;
        admin.loginCount = 0;
        admin.isLocked = false; // Unlock if it was previously locked
        admin.lockedUntil = null; // Clear lockedUntil

        // Save changes to the database
        await this.adminrepository.save(admin);

        // Generate and return access token
        return await this.setToken(admin.id, admin.email, admin.role);
    }


    //UPDATE PROFILE
    async updateAdmin(id: number, dto: UpdateAdminDto): Promise<{ message: string }> {

        //check if admin is regsitered
        const admin = await this.adminrepository.findOne({ where: { id } })
        if (!admin) {
            throw new BadRequestException('cannot update account')
        }

        //update
        admin.email = dto.email;
        admin.name = dto.name;

        //save changes
        await this.adminrepository.save(admin)

        return { message: 'admin profile updated' }
    }

    //DELETE PROFILE
    async deleteAdmin(id: number): Promise<{ message: string }> {
        //check if admin is registered
        const admin = await this.adminrepository.findOne({ where: { id } })
        if (!admin) {
            throw new BadRequestException('admin cannot delete account')
        }

        //delete
        await this.adminrepository.remove(admin)

        return { message: 'Admin deleted' }
    }

    //CHANGE PASSWORD
    async changeAdminPassword(id: number, dto: ChangeAdminPasswordDto): Promise<{ message: string }> {
        const admin = await this.adminrepository.findOne({ where: { id } })
        if (!admin) {
            throw new BadRequestException('admin cannot change password')
        }

        //check if the old password is correct
        const password = await this.comparePassword(dto.oldPassword, admin.password)
        if (!password) {
            throw new BadRequestException('incorrect password')
        }

        //hash new password
        const hash = await this.hashPassword(dto.newPassword)

        //update password
        admin.password = hash;

        //save to database
        await this.adminrepository.save(admin)

        return { message: 'password changed' }
    }

    //UPDATE USER PROFILE
    async adminUpdateUser(adminId: number, userId: number, dto: AdminUpdateUserDto): Promise<{ message: string }> {
        //check if admin is registered
        const admin = await this.adminrepository.findOne({ where: { id: adminId } })
        if (!admin) {
            throw new BadRequestException('admin is not registered')
        }

        // check if user is registered
        const user = await this.userrepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new BadRequestException('user has not registered')
        }

        //make changes
        user.name = dto.name;
        user.username = dto.username;

        //save to database
        await this.userrepository.save(user)

        return { message: 'Admin updated user profile' }
    }


    //DELETE USER PROFILE
    async adminDelete(adminId: number, userId: number): Promise<{ message: string }> {
        //find admin
        const admin = await this.adminrepository.findOne({ where: { id: adminId } })
        if (!admin) {
            throw new BadRequestException('admin has to register')
        }

        //check if the user account is stil active
        const user = await this.userrepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new BadRequestException('wrong user')
        }

        await this.userrepository.remove(user)

        return { message: 'user deleted by admin' }
    }


    //SEND USER EMAIL
    async adminSendMail(id: number): Promise<{ message: string }> {
        //find id
        const admin = await this.adminrepository.findOne({ where: { id } })
        if (!admin) {
            throw new BadRequestException('admin is not allowed')
        }

        //get all registered user
        const allUser = await this.userrepository.find()
        if (!allUser) {
            throw new NotFoundException('no user found')
        }

        //send email
        // Use map to send email to all users
        await Promise.all(allUser.map(user => this.mailer.mailToUsers(user.email, user.name)))


        return { message: 'mail sent to users'}
    }

    //GET ALL USERS
    async allUsers(id: number): Promise<UserEntity[]> {
        const admin = await this.adminrepository.findOne({ where: { id } })
        if (!admin) {
            throw new BadRequestException('admin cannot get users')
        }

        const user = await this.userrepository.find()
        return user;
    }

    //GET A USER
    async getOneUser(adminId: number, userId: number) {
        const admin = await this.adminrepository.findOne({ where: { id: adminId } })
        if (!admin) {
            throw new BadRequestException('not admin please')
        }

        const user = await this.userrepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new BadRequestException('admin cannot get this user')
        } else {
            return user;
        }
    }

}
