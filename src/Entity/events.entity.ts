import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { AdminEntity } from "./admin.entity";

export interface IEvents {
    id: number;
    planner: string;
    location: string;
    type: string;
    title: string;
    creatdAt: Date;
    date: string;
    time: string;
}


@Entity({ name: 'events'})
export class EventEntity implements IEvents {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    planner: string;

    @Column({ nullable: true})
    title: string;

    @Column()
    location: string;

    @Column()
    type: string;

    @CreateDateColumn({ type: 'timestamp'})
    creatdAt: Date;

    @Column({ nullable: true})
    date: string

    @Column({ nullable: true })
    time: string;

    @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.event)
    user: UserEntity

    @ManyToOne(() => AdminEntity, (AdminEntity) => AdminEntity.event)
    admin: AdminEntity
}