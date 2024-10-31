import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CreateEventDto, RegisterEventDto } from 'src/events/events.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { AdminRolesGuard } from 'src/auth/guard/admin.role.guard';
import { Roles } from 'src/auth/decorators.ts/role.decorators';
import { Role } from 'src/Enum/general.enum';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserRoleGuard } from 'src/auth/guard/user.role.guard';


@UseGuards(JwtGuard)

@ApiTags('cms')
@Controller('cms')
export class CmsController {
    constructor(private readonly cmsservice: CmsService) { }

    //admin uploads new event
    @UseGuards(AdminRolesGuard)
    @Roles(Role.ADMIN)
    @Post('/upload/:id')
    @ApiCreatedResponse({ description: 'event posted by admin' })
    @ApiBadRequestResponse({ description: 'event not posted' })
    async uploadEvent(@Param('id') id: number, @Body() dto: CreateEventDto) {
        return await this.cmsservice.uploadEvent(id, dto)
    }

    //user get the list of the available events
    @UseGuards(UseGuards)
    @Roles(Role.USER)
    @Get('/events/:id')
    @ApiCreatedResponse({ description: 'user gets an event' })
    @ApiBadRequestResponse({ description: 'no event' })
    async userGetEvent(@Param('userId') userId: number) {
        await this.cmsservice.userViewEvent(userId)
    }

    //user register for an event
    @UseGuards(UserRoleGuard)
    @Roles(Role.USER)
    @Post('/registration/:userId/:eventId')
    @ApiCreatedResponse({ description: 'user registers for an event' })
    @ApiBadRequestResponse({ description: 'user cannot register for event' })
    async userRegister(@Param('userId') userId: number, @Param('eventId') eventId: number,
        @Body() dto: RegisterEventDto) {
        await this.cmsservice.userRegister(userId, eventId, dto)
    }

     
}
