import { Role } from "src/Enum/general.enum";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventEntity } from "./events.entity";
import { UserOtp } from "./otp.entity";
import { AdminEntity } from "./admin.entity";

 export interface IUser {
    name: string;
    username: string;
    email: string
    password: string;
    id: number;
    createdAt: Date;
    resetLink: string;
    resetLinkExpirationTime: Date;
    isResetLinkSent: boolean;
    isVerified: boolean;
    isRegistered: boolean;
    isLoggedIn: boolean;
    isLocked: boolean;
    loginCount: number;
    lockedUntil: Date;
    role: Role
 }

 @Entity({ name: 'user'})
 export class UserEntity implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false})
    name: string;

    @Column({ unique: true, nullable: false})
    username: string;

    @Column({ unique: true, nullable: false})
    email: string;

    @Column({ nullable: false})
    password: string;

    @Column({ nullable: false})
    createdAt: Date;

    @Column({ nullable: false, default: false })
    isLoggedIn: boolean;

    @Column({ nullable: false, default: false })
    isVerified: boolean;

    @Column({ nullable: false, default: false })
    isRegistered: boolean;

    @Column({ nullable: true})
    resetLink: string;
    
     @Column({ nullable: true })
    isResetLinkSent: boolean;
    
    @Column({ nullable: true })
    resetLinkExpirationTime: Date;

    @Column({ nullable: false, default: 0})
    loginCount: number;

    @Column({ nullable: true})
    isLocked: boolean

    @Column({ nullable: true})
    lockedUntil: Date;

    @Column({ nullable: false, type: 'enum' , enum: Role, default: Role.USER})
    role: Role;

    @OneToOne(() => UserOtp, (UserOtp) => UserOtp.user, { cascade: true, onDelete: 'CASCADE'})
    otp: UserOtp

    @OneToMany(() => EventEntity, (EventEntity) => EventEntity.user)
    event: EventEntity[]

    @ManyToOne(() => AdminEntity, (AdminEntity) => AdminEntity.user)
    admin: AdminEntity
 }