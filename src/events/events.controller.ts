import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './events.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('event')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsservice: EventsService) { }

    @Post('/create')
    @ApiCreatedResponse({ description: 'new event created'})
    @ApiBadRequestResponse({ description: 'event not created'})
    async createEvent(@Body() dto: CreateEventDto) {
        return await this.eventsservice.createEvent(dto)
    }

    @Get('/get')
    @ApiCreatedResponse({ description: 'get all event'})
    @ApiBadRequestResponse({ description: 'no event'})
    async getEvent() {
        return await this.eventsservice.getEvent()
    }

    @Get('/get/:id')
    @ApiCreatedResponse({ description: 'an event'})
    @ApiBadRequestResponse({ description: 'cannot get event'})
    async getOne(@Param('id') id: number) {
        return await this.eventsservice.getAnEvent(id)
    }

    @Put('/update/:id')
    @ApiCreatedResponse({ description: 'event updated'})
    @ApiBadRequestResponse({ description: 'event not updated'})
    async updateEvent(@Param('id') id: number, @Body() dto: UpdateEventDto) {
        return await this.eventsservice.updateEvent(id, dto)
    }

    @Delete('/delete/:id')
    @ApiCreatedResponse({ description: 'event deleted'})
    @ApiBadRequestResponse({ description: 'cannot delete event'})
    async deleteEvent(@Param('id') id: number) {
        return await this.eventsservice.deleteEvent(id)
    }
}

