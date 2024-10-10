import { Module } from '@nestjs/common';
import { CmsService } from './cms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/Entity/admin.entity';
import { UserEntity } from 'src/Entity/user.entity';
import { EventEntity } from 'src/Entity/events.entity';
import { AdminRepository } from 'src/admin/admin.repository';
import { UserRepository } from 'src/user/user.repository';
import { EventRepository } from 'src/events/events.repository';
import { CmsController } from './cms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, UserEntity, EventEntity])],
  controllers: [CmsController],
  providers: [CmsService, AdminRepository, UserRepository, EventRepository]
})
export class CmsModule {}
