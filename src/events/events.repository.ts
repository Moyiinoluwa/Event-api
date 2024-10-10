import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity } from "src/Entity/events.entity";
import { Repository } from "typeorm";

@Injectable()
export class EventRepository extends Repository<EventEntity> {
    constructor (@InjectRepository(EventEntity) private readonly eventrepository: EventRepository) {
        super(eventrepository.target,
            eventrepository.manager,
            eventrepository.queryRunner
        )
    }
}