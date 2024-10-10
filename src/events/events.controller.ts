import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './events.dto';

@Controller('events')
export class EventsController {
    constructor ( private readonly eventsservice: EventsService) {}

    @Post('/create') 
    async createEvent(@Body() dto: CreateEventDto) {
        return await this.eventsservice.createEvent(dto)
    }

    @Get('/get')
    async getEvent() {
        return await this.eventsservice.getEvent()
    }
         
    @Get('/get/:id')
    async getOne(@Param('id') id: number) {
        return await this.eventsservice.getAnEvent(id)
    }
    
    @Put('/update/:d')
    async updateEvent(@Param('id') id: number, @Body() dto: UpdateEventDto) {
        return await this.eventsservice.updateEvent(id, dto)
    }

    @Delete('/delete/:id')
    async deleteEvent(@Param('id') id: number) {
        return await this.eventsservice.deleteEvent(id)
    }
}

