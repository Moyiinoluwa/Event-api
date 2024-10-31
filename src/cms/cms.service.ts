import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from 'src/admin/admin.repository';
import { EventEntity } from 'src/Entity/events.entity';
import { CreateEventDto, RegisterEventDto } from 'src/events/events.dto';
import { EventRepository } from 'src/events/events.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class CmsService {
    constructor(@InjectRepository(AdminRepository) private readonly adminrepository: AdminRepository,
        @InjectRepository(EventRepository) private readonly eventrepository: EventRepository,
        @InjectRepository(UserRepository) private readonly userrpository: UserRepository) { }

    // ADMIN UPLOADS EVENT
    async uploadEvent(id: number, dto: CreateEventDto): Promise<{ message: string }> {
        //check if the admin is regsitered
        const admin = await this.adminrepository.findOne({ where: { id } })
        if (!admin) {
            throw new NotFoundException('admin cannot upload event')
        }

        //check if the event has been uploaded before
        const event = await this.eventrepository.findOne({ where: { id } })
        if (!event) {
            throw new NotFoundException('Cannot post the same event twice')
        }

        // create new event
        const newEvent = new EventEntity();
        newEvent.date = dto.date
        newEvent.location = dto.location;
        newEvent.planner = dto.planner;
        newEvent.type = dto.type;
        newEvent.title = dto.title;
        newEvent.time = dto.time;

        //save to database
        await this.eventrepository.save(newEvent);

        return { message: 'Admin created new Event' }
    }


    //USERS CAN VIEW ALL EVENT
    async userViewEvent(userId: number): Promise<EventEntity[]> {

        //check if user is registered
        const user = await this.userrpository.findOne({ where: { id: userId } })
        if (!user) {
            throw new BadRequestException('user can not get the list of event')
        }

        //list of events available
        const event = await this.eventrepository.find()
        if (event.length === 0) {
            throw new BadRequestException('There are no events at the moment')
        }

        return event;
    }


    // USER REGISTERS FOR EVENT
    async userRegister(userId: number, eventId: number, dto: RegisterEventDto): Promise<{ message: string }> {
        //check if user is regsitered
        const user = await this.userrpository.findOne({ where: { id: userId } })
        if (!user) {
            throw new NotFoundException('user is not registered')
        }

        //check if event is available
        const event = await this.eventrepository.find({ where: { id: eventId } })
        if (!event) {
            throw new NotFoundException('event is not available')
        }

        //register for event
        user.name = dto.name;
        user.email = dto.email;

        //check if user wants to register for the same event twice
        // if(userId) {

        // }

        //save to event database
        await this.userrpository.save(user);

        return { message: 'User registered for event successfully' }
    }

     
    //USER CAN SEARCH FOR EVENT BY CATEGORY
    //USER CAN PAY FOR EVENT
}
