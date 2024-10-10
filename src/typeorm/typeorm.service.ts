import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AdminEntity } from 'src/Entity/admin.entity';
import { AdminOtpEntity } from 'src/Entity/adminOtp.entity';
import { EventEntity } from 'src/Entity/events.entity';
import { UserOtp } from 'src/Entity/otp.entity';
import { UserEntity } from 'src/Entity/user.entity';

@Injectable()
export class TypeormService {
    constructor(private configservice: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return {
            type: 'postgres',
            host: this.configservice.get('DB_HOST'),
            port: this.configservice.get('DB_PORT'),
            username: this.configservice.get('DB_USERNAME'),
            password: String(this.configservice.get('DB_PASSWORD')),
            database: this.configservice.get('DB_DATABASE'),
            entities: [UserEntity,
                    UserOtp,
                    AdminEntity,
                    AdminOtpEntity,
                    EventEntity
            ],
            synchronize: true,
        }
    }
}
