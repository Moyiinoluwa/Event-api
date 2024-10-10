import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminOtpEntity } from "src/Entity/adminOtp.entity";
import { UserOtp } from "src/Entity/otp.entity";
import { Repository } from "typeorm";

@Injectable()
    export class UserOtpRepository extends Repository<UserOtp> {
        constructor (@InjectRepository(UserOtp) private readonly userotpRepository: UserOtpRepository) {
            super(userotpRepository.target,
                userotpRepository.manager,
                userotpRepository.queryRunner
            )
        }
    }

    @Injectable()
        export class AdminOtpRepository extends Repository<AdminOtpEntity> {
            constructor(@InjectRepository(AdminOtpEntity) private readonly adminotprepository: AdminOtpRepository) {
                super(adminotprepository.target,
                    adminotprepository.manager,
                    adminotprepository.queryRunner
                )
            }
        }