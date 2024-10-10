import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from 'src/admin/admin.repository';
import { AdminEntity } from 'src/Entity/admin.entity';
import { UserEntity } from 'src/Entity/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(AdminEntity) private readonly adminrepository: AdminRepository,
                @InjectRepository(UserEntity) private readonly userrepository: UserRepository) {}

    //VALIDATE THE USER AND ADMIN BY ID AND ROLE

    async validateUserandAdmin(id: number, role: string) {
        switch (role) {
            case 'admin':
                return await this.adminrepository.findOne({ where: { id }})
            
            case 'user': 
                return await this.userrepository.findOne({ where: { id }})
        
            default:
                return null
        }
    }
}
