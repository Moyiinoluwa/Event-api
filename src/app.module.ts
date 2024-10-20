import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeormModule } from './typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormService } from './typeorm/typeorm.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminModule } from './admin/admin.module';
import { EventsModule } from './events/events.module';
import { CmsModule } from './cms/cms.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeormService}),
    ConfigModule.forRoot({ isGlobal: true}),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.AUTH_PASSWORD
        }
      }
    }),
    UserModule,
     TypeormModule,
     AdminModule,
     EventsModule,
     CmsModule,
     AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
