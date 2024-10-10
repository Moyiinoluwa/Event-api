import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './user.dto';
import * as bcrypt from 'bcrypt'
import { customAlphabet } from 'nanoid';
import { UserEntity } from 'src/Entity/user.entity';
import { UserOtp } from 'src/Entity/otp.entity';
import { UserOtpRepository } from 'src/Common/common.repository';
import { Mailer } from 'src/Mailer/mailer.service';
import {
    ChangeUserPasswordDto, LoginDto, ResendUserOtpDto, ResetPasswordLinkOtpDto,
    ResetPasswordOtpDto, UpdateUserDto, VerifyOtpDto
} from 'src/Common/common.dto';
import { LessThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        @InjectRepository(UserOtpRepository) private readonly userotpRepository: UserOtpRepository,
        private readonly mailer: Mailer,
        private jwt: JwtService,
        private configservice: ConfigService
    ) { }


    //HASH PASSWORD FOR REGISTRATION
    async hashPassword(password: any): Promise<string> {
        return await bcrypt.hash(password, 12)
    }

    //Compare password to grant login access
    async comparePassword(password: any, userPassword: any): Promise<boolean> {
        return await bcrypt.compare(password, userPassword)

    }

    //generate verfication code
    async generateCode() {
        const code = customAlphabet('0123456789', 6)
        return code();
    }

    //login access token
    async loginToken(id: number, email: string, role: string) {
        const payload = {
            sub: id,
            email,
            role
        };

        const secret = this.configservice.get('SECRET_KEY')
        const token = await this.jwt.signAsync(payload, {
            expiresIn: this.configservice.get('EXPIRESIN'),
            secret: secret
        });

        return { accessToken: token }
    }


    //REGISTER USER.
    async registerUser(dto: RegisterUserDto): Promise<{ message: string }> {

        //check  if user is registered
        const user = await this.userRepository.findOne({ where: { email: dto.email } })
        if (user) {
            throw new UnauthorizedException('user is registered')
        }

        //Hash user password
        const hash = await this.hashPassword(dto.password)

        //create a new user
        const newUser = new UserEntity();
        newUser.email = dto.email;
        newUser.name = dto.name;
        newUser.username = dto.username;
        newUser.password = hash;
        newUser.createdAt = new Date();

        //save to database
        await this.userRepository.save(newUser);

        //set verificaton code
        const otpCode = await this.generateCode();

        //expiration time for otp code
        const time = new Date();
        time.setMinutes(time.getMinutes() + 10)

        //create new verification code user
        const userCode = new UserOtp();
        userCode.email = dto.email;
        userCode.expirationTime = time;
        userCode.verified = false;
        userCode.otp = otpCode;

        //save to database
        await this.userotpRepository.save(userCode)

        //send verification code to user via mail
        await this.mailer.verificationMail(dto.email, otpCode, dto.username)

        return { message: 'user regsitered' }
    }



    //VERIFY OTP
    async verifyOtp(dto: VerifyOtpDto): Promise<{ message: string }> {

        // Check if the OTP and email match in a single query
        const userOtp = await this.userotpRepository.findOne({ where: { email: dto.email, otp: dto.otp }, });

        // If the record doesn't exist, either the email or the OTP is incorrect
        if (!userOtp) {
            throw new ForbiddenException('The email or OTP you entered is incorrect');
        }

        // Check if the verification code has expired
        if (userOtp.expirationTime <= new Date()) {
            throw new BadRequestException('The code has expired');
        }

        // Find the user attached to the email
        const user = await this.userRepository.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new BadRequestException('User is not registered');
        }

        // Update user profile
        user.isLoggedIn = true;
        user.isRegistered = true;
        user.isVerified = true;

        // Update OTP status to verified
        userOtp.verified = true;

        // Save the user and the OTP verification status in the database
        await this.userRepository.save(user);
        await this.userotpRepository.save(userOtp);

        return { message: 'Code verified successfully' };
    }



    // RESEND OTP
    async resendOtp(dto: ResendUserOtpDto): Promise<{ message: string }> {

        // Check if the user is registered
        const user = await this.userRepository.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new NotFoundException('User cannot request a new code');
        }

        // Check if an OTP exists for this email
        const existingOtp = await this.userotpRepository.findOne({ where: { email: dto.email } });

        // If an OTP exists and has not expired, do not send a new one
        if (existingOtp && existingOtp.expirationTime > new Date()) {
            throw new BadRequestException('Previous code has not expired. Please wait before requesting a new one.');
        }

        // Generate a new OTP code 
        const newCode = await this.generateCode();

        // Set expiration time for the new code 
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 10);

        // Create a new OTP record 
        const newOtp = new UserOtp();
        newOtp.email = dto.email;
        newOtp.otp = newCode;
        newOtp.expirationTime = expirationTime;
        newOtp.createdAt = new Date();

        // Save the new OTP to the database
        await this.userotpRepository.save(newOtp);

        // Send the new OTP via email
        await this.mailer.verificationMail(dto.email, newCode, user.username);

        return { message: 'Code resent successfully' };
    }



    //RESET PASSWORD LINK
    async resetPasswordLink(dto: ResetPasswordLinkOtpDto): Promise<{ message: string }> {
        //check if the email is regsitered
        const user = await this.userRepository.findOne({ where: { email: dto.email } })
        if (!user) {
            throw new BadRequestException('user cannot request for link')
        }
        //set the reset token
        const link = uuidv4();

        //create the reset link
        const linkk = `http://localhost:3000/user/reset-password?=${link}`

        //set expiration time for the link
        const linkExpiry = new Date();
        linkExpiry.setMinutes(linkExpiry.getMinutes() + 10)

        //save to database 
        user.resetLink = linkk;
        user.isResetLinkSent = true;
        user.resetLinkExpirationTime = linkExpiry;

        //send link to user via mail
        await this.mailer.resetPasswordMail(dto.email, link, user.name)

        return { message: 'Reset link sent' }
    }


    //RESET PASSWORD
    async resetPassword(dto: ResetPasswordOtpDto): Promise<{ message: string }> {

        //check if the user is registered
        const user = await this.userRepository.findOne({ where: { email: dto.email } })
        if (!user) {
            throw new NotFoundException('User cannot access reset link')
        }

        //check if the link is valid
        if (user.resetLink !== dto.resetLink) {
            throw new BadRequestException('you entered the wrong link')
        }

        //hash password
        const hash = await this.hashPassword(dto.password)

        //save to database
        user.password = hash;

        return { message: 'Password reset successfully' }
    }

    //LOGIN
    async userLogin(dto: LoginDto) {
        //check if user is registered
        const user = await this.userRepository.findOne({ where: { email: dto.email } })
        if (!user) {
            throw new UnauthorizedException('user cannot login')
        }

        //compare the password
        const pass = await this.comparePassword(dto.password, user.password)
        if (!pass) {
            user.loginCount = + 1;
        }

        //check if the user has exceeded the login attempts
        if (user.loginCount >= 5) {
            user.isLocked = true;
            user.lockedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000) //lock account for two hours
            throw new BadRequestException('wrong password, account is locked')
        }

        //if the password matches, reset the login count and unlock the account
        user.loginCount = 0,
            user.isLoggedIn = true

        //save to database
        await this.userRepository.save(user)

        return await this.loginToken(user.id, user.email, user.role)
    }


    //CHANGE PASSWORD
    async changePassword(id: number, dto: ChangeUserPasswordDto): Promise<{ message: string }> {
        //check if user is registered
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new UnauthorizedException(' user cannot change password')
        }

        //compare password
        const thePassword = await this.comparePassword(dto.oldPassword, user.password)
        if (!thePassword) {
            throw new BadRequestException(' The password is not correct')
        }

        //if the password matches, change the password
        const hash = await this.hashPassword(dto.newPassword)

        //update profile
        user.password = hash;

        // save to database
        await this.userRepository.save(user)

        return { message: 'password changed' }
    }

    //UPDATE PROFILE
    async updateProfile(id: number, dto: UpdateUserDto): Promise<{ message: string }> {
        //check if the user is registered
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new BadRequestException(' user cannot update profile')
        }

        //update
        user.name = dto.name;
        user.email = dto.email;
        user.username = dto.username;

        //save changes to database
        await this.userRepository.save(user)

        return { message: 'profile updated' }
    }

    //DELETE PROFILE
    async deleteUser(id: number): Promise<{ message: string }> {
        //verify userby id
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new BadRequestException('user cannot delete profile')
        }

        //delete user
        await this.userRepository.remove(user)

        return { message: 'user profile deleted' }
    }

}


//problems
//resend otp
