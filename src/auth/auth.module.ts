import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/Entity/admin.entity';
import { UserEntity } from 'src/Entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AdminRolesGuard } from './guard/admin.role.guard';
import { JwtGuard } from './guard/jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, UserEntity]),
          JwtModule.registerAsync({
            useFactory: () => ({
              secret: process.env.SECRET_KEY,
              signOptions: {
                expiresIn: process.env.EXPIRESIN
              }
            })
          })],
  providers: [AuthService, JwtStrategy, AdminRolesGuard, JwtGuard]
})

export class AuthModule {}
