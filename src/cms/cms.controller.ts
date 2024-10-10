import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CreateEventDto, RegisterEventDto } from 'src/events/events.dto';

@Controller('cms')
export class CmsController {
    constructor(private readonly cmsservice: CmsService) {}

    //admin uploads new event
    @Post('/upload/:id')
    async uploadEvent(@Param('id') id: number, @Body() dto: CreateEventDto) {
        return await this.cmsservice.uplaodEvent(id, dto)
    }

    //admin deletes an existing event
    @Delete('/admin-delete/:id/:id') 
    async deleteEvent(@Param('adminId') adminId: number, @Param('eventId') eventId: number) {
        await this.cmsservice.DeleteEvent(adminId, eventId)
    }

    //user get the list of the available events
    @Get('/events/:id')
    async userGetEvent(@Param('id') id: number) {
        await this.cmsservice.viewEvent(id)
    }

    //user register for an event
    @Post('/registration/:id')
    async userRegister(@Param('userId') userId: number, @Param('eventId') eventId: number, 
    @Body() dto: RegisterEventDto) {
        await this.cmsservice.userRegister(userId, eventId, dto)
    }

    //admin gets all events
    @Get('/get-events/:id')
    async getAllEvents(@Param('id') id: number) {
        await this.cmsservice.adminGetEvents(id)
    }

    //admin get a single event
    @Get('/get-event/:id/:id')
    async getAnEvent(@Param('adminId') adminId: number, @Param('eventId') eventId: number) {
        await this.cmsservice.adminGetAnEvent(adminId, eventId)
    }
}
