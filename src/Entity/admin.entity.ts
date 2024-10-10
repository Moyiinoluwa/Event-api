import { Role } from "src/Enum/general.enum";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminOtpEntity } from "./adminOtp.entity";
import { UserEntity } from "./user.entity";
import { EventEntity } from "./events.entity";

export interface IAdmin {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    resetLink: string;
    isResetLinkSent: boolean;
    resetLinkExiprationTime: Date;
    loginCount: number;
    isLoggedIn: boolean;
    lockedUntil: Date;
    isLocked: boolean;
    role: Role

}

@Entity({ name: 'admin'})
 export class AdminEntity implements IAdmin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, unique: true})
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    createdAt: Date;

    @Column({ nullable: true })
    resetLink: string;

    @Column({nullable: true})
    isResetLinkSent: boolean;

    @Column({ nullable: true })
    resetLinkExiprationTime: Date;

    @Column({ nullable: false, default: 0})
    loginCount: number;

    @Column({ nullable: true })
    isLocked: boolean;

    @Column({ nullable: false, default: false })
    isLoggedIn: boolean;

    @Column({ nullable: true })
    lockedUntil: Date;

    @Column({ nullable: false, type: 'enum', enum: Role, default: Role.ADMIN})
    role: Role;

    @OneToOne(() => AdminOtpEntity, (AdminOtpEntity) => AdminOtpEntity.admin, { cascade: true })
    otp: AdminOtpEntity

    @OneToMany(() => UserEntity, (UserEntity) => UserEntity.admin)
    user: UserEntity[]
    
    @OneToMany(() => EventEntity, (EventEntity) => EventEntity.admin)
    event: EventEntity[]
 }