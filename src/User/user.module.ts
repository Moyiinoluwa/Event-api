import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/Entity/user.entity';
import { UserRepository } from './user.repository';
import { UserOtp } from 'src/Entity/otp.entity';
import { UserOtpRepository } from 'src/Common/common.repository';
import { Mailer } from 'src/Mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ UserEntity, UserOtp])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserOtpRepository, Mailer, JwtService]
})
export class UserModule {}
