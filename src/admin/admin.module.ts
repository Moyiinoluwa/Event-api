import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/Entity/admin.entity';
import { AdminOtpEntity } from 'src/Entity/adminOtp.entity';
import { AdminOtpRepository } from 'src/Common/common.repository';
import { AdminRepository } from './admin.repository';
import { Mailer } from 'src/Mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { UserEntity } from 'src/Entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, AdminOtpEntity, UserEntity])],
  controllers: [AdminController],
  providers: [AdminService, AdminOtpRepository, UserRepository,  AdminRepository, Mailer, JwtService ]
})
export class AdminModule {}
