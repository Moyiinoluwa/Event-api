import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CreateEventDto, RegisterEventDto } from 'src/events/events.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators.ts/role.decorators';
import { Role } from 'src/Enum/general.enum';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';


@UseGuards(JwtGuard)

@ApiTags('cms')
@Controller('cms')
export class CmsController {
    constructor(private readonly cmsservice: CmsService) {}

    //admin uploads new event
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Post('/upload/:id')
    @ApiCreatedResponse({ description: 'event posted by admin'})
    @ApiBadRequestResponse({ description: 'event not posted'})
    async uploadEvent(@Param('id') id: number, @Body() dto: CreateEventDto) {
        return await this.cmsservice.uplaodEvent(id, dto)
    }

    //admin deletes an existing event
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('/admin-delete/:id/:id') 
    @ApiCreatedResponse({ description: 'event deleted by admin'})
    @ApiBadRequestResponse({ description: 'cannot delete event'})
    async deleteEvent(@Param('adminId') adminId: number, @Param('eventId') eventId: number) {
        await this.cmsservice.DeleteEvent(adminId, eventId)
    }

    //user and admin get the list of the available events
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Get('/events/:id')
    @ApiCreatedResponse({ description: 'user or admin gets an event'})
    @ApiBadRequestResponse({ description: 'no event'})
    async userGetEvent(@Param('id') id: number) {
        await this.cmsservice.viewEvent(id)
    }

    //user register for an event
    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Post('/registration/:id')
    @ApiCreatedResponse({ description: 'user registers for an event'})
    @ApiBadRequestResponse({ description: 'user cannot register for event'})
    async userRegister(@Param('userId') userId: number, @Param('eventId') eventId: number, 
    @Body() dto: RegisterEventDto) {
        await this.cmsservice.userRegister(userId, eventId, dto)
    }

    //admin  and user gets all events
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Get('/get-events/:id')
    @ApiCreatedResponse({ description: 'admin or user gets all event'})
    @ApiBadRequestResponse({ description: 'no access'})
    async getAllEvents(@Param('id') id: number) {
        await this.cmsservice.adminGetEvents(id)
    }

    //admin or user get a single event
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Get('/get-event/:id/:id')
    @ApiCreatedResponse({ description: 'user or admin get an event'})
    @ApiBadRequestResponse({ description: 'user or admin not allowed'})
    async getAnEvent(@Param('adminId') adminId: number, @Param('eventId') eventId: number) {
        await this.cmsservice.adminGetAnEvent(adminId, eventId)
    }
}
