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
    async uplaodEvent(id: number, dto: CreateEventDto): Promise<{ message: string }> {
        //check if the admin is regsitered
        const admin = await this.adminrepository.findOne({ where: { id } })
        if (!admin) {
            throw new BadRequestException('admin cannot upload event')
        }

        //check if the event has been uploaded before
        const event = await this.eventrepository.findOne({ where: { id } })
        if (!event) {
            throw new BadRequestException('Cannot post the same event twice')
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


    //ADMIN DELETE EVENT
    async DeleteEvent(adminId: number, eventId: number ): Promise<{ message: string }> {

        //check if admin is regsitered
        const admin = await this.adminrepository.findOne({ where: { id: adminId } })
        if (!admin) {
            throw new BadRequestException('admin cannot delete event')
        }

        //check if the event is available
        const event = await this.eventrepository.findOne({ where: { id: eventId} })
        if (!event) {
            throw new BadRequestException('event does not exist')
        }

        //delete the event
        await this.eventrepository.remove(event)

        return { message: 'event deleted by admin' }

        //problem
        //not returning message after deleting event
    }


    //USERS CAN VIEW ALL EVENT
    async viewEvent(id: number): Promise<EventEntity[]> {

        //check if user is registered
        const user = await this.userrpository.findOne({ where: { id } })
        if (!user) {
            throw new BadRequestException('user can get the list of event')
        }

        //list of events available
        const event = await this.eventrepository.find()
        if (!event) {
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
        await this.userrpository.save(event);

        return { message: 'User registered for event successfully' }
    }

    //ADMIN GET ALL EVENTS
    async adminGetEvents(id: number): Promise<EventEntity[]> {
        //check if admin is registered
        const admin = await this.adminrepository.findOne({ where: { id } })
        if (!admin) {
            throw new NotFoundException('admin cannot get users')
        }

        const event = await this.eventrepository.find()
        if (!event) {
            throw new NotFoundException('no event')
        }
            return event;
    }

    //ADMIN GETS AN EVENT
    //check if admin is register
    async adminGetAnEvent(adminId: number, eventId: number) {
        const admin = await this.adminrepository.findOne({ where: { id: adminId }})
        if(!admin) {
            throw new NotFoundException('admin cannot get this event')
        }

        //check if event is available
        const event = await this.eventrepository.findOne({ where: { id: eventId }})
        if(!event) {
            throw new NotFoundException('This event is not available')
        } else {
            return event;
        }
    }
    //USER CAN SEARCH FOR EVENT BY CATEGORY
    //USER CAN PAY FOR EVENT
}
