import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/Entity/user.entity";
import { Repository } from "typeorm";

 @Injectable()
 export class UserRepository extends Repository<UserEntity> {
    constructor (@InjectRepository(UserEntity) private  readonly userRepository: UserRepository) {
        super(userRepository.target,
            userRepository.manager,
            userRepository.queryRunner
        )
    }
 }