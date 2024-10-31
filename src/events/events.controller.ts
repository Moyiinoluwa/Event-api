import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './events.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { AdminRolesGuard } from 'src/auth/guard/admin.role.guard';
import { Roles } from 'src/auth/decorators.ts/role.decorators';
import { Role } from 'src/Enum/general.enum';



@ApiTags('event')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsservice: EventsService) { }


    @UseGuards(AdminRolesGuard)
    @UseGuards(JwtGuard)
    @Roles(Role.ADMIN)
    @Post('/create')
    @ApiCreatedResponse({ description: 'new event created' })
    @ApiBadRequestResponse({ description: 'event not created' })
    async createEvent(@Body() dto: CreateEventDto) {
        return await this.eventsservice.createEvent(dto)
    }


    @UseGuards(AdminRolesGuard)
    @UseGuards(JwtGuard)
    @Roles(Role.ADMIN)
    @Get('/get')
    @ApiCreatedResponse({ description: 'get all event' })
    @ApiBadRequestResponse({ description: 'no event' })
    async getEvent() {
        return await this.eventsservice.getEvent()
    }


    @UseGuards(AdminRolesGuard)
    @UseGuards(JwtGuard)
    @Roles(Role.ADMIN)
    @Get('/get/:id')
    @ApiCreatedResponse({ description: 'an event' })
    @ApiBadRequestResponse({ description: 'cannot get event' })
    async getOne(@Param('id') id: number) {
        return await this.eventsservice.getAnEvent(id)
    }



    @UseGuards(AdminRolesGuard)
    @UseGuards(JwtGuard)
    @Roles(Role.ADMIN)
    @Put('/update/:id')
    @ApiCreatedResponse({ description: 'event updated' })
    @ApiBadRequestResponse({ description: 'event not updated' })
    async updateEvent(@Param('id') id: number, @Body() dto: UpdateEventDto) {
        return await this.eventsservice.updateEvent(id, dto)
    }


    @UseGuards(AdminRolesGuard)
    @UseGuards(JwtGuard)
    @Roles(Role.ADMIN)
    @Delete('/delete/:id')
    @ApiCreatedResponse({ description: 'event deleted' })
    @ApiBadRequestResponse({ description: 'cannot delete event' })
    async deleteEvent(@Param('id') id: number) {
        return await this.eventsservice.deleteEvent(id)
    }
}

