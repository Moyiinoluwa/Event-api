import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from './events.repository';
import { CreateEventDto, UpdateEventDto } from './events.dto';
import { EventEntity } from 'src/Entity/events.entity';

@Injectable()
export class EventsService {
    constructor(@InjectRepository(EventRepository) private readonly eventrepository: EventRepository) {}


    //CREATE A NEW EVENT
    async createEvent ( dto: CreateEventDto): Promise<{ message: string}> {

         //check if the same event has been created
         const event = await this.eventrepository.findOne({ where: { title: dto.title }})
         if(event) {
            throw new BadRequestException('This event has been created')
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

        return { message: 'Event created'}
    }

    //GET ALL EVENT
    async getEvent(): Promise<EventEntity[]> {
        const event = await this.eventrepository.find()
        return event;
    }

    //GET AN EVENT
    async getAnEvent(id: number) {
        const event = await this.eventrepository.findOne({ where: { id }})
        if(!event) {
            throw new BadRequestException('cannot event this event')
        }  else {
            return event;
        }
    }

    //UPDATE EVENT
    async updateEvent(id: number, dto: UpdateEventDto): Promise<{message: string}> {
        //find the event
        const event = await this.eventrepository.findOne({ where: { id }}) 
        if(!event) {
            throw new BadRequestException('cannot update event')
        }

        //update
        event.date = dto.date;
        event.location = dto.location;
        event.planner = dto.planner;
        event.type = dto.type;

        //save changes to database
        await this.eventrepository.save(event);

        return { message: 'event updated'}

        //updating the wrong event
    }

    //DELETE EVENT
    async deleteEvent(id: number): Promise<{ message: string }> {
        //find the event to delete
        const event = await this.eventrepository.findOne({ where: { id }})
        if(!event) {
            throw new BadRequestException('cannot delete event')
        }

        //delete
        await this.eventrepository.remove(event)

        return { message: 'event deleted'}
    }


    //problem 
    //Update endpoint is updating all the events
}
