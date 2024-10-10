import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminEntity } from "./admin.entity";

export interface IAdminOtp {
    id: number;
    otp: string;
    email: string;
    expirationTime: Date;
    verified: boolean;
    createdAt: Date;
}

@Entity({ name: 'adminOtp'})
export class AdminOtpEntity implements IAdminOtp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    otp: string;

    @Column({ unique: true, nullable: false})
    email: string;

    @Column({ nullable: false })
    expirationTime: Date;

    @Column({ type: 'boolean', default: false })
    verified: boolean;

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date;

    @OneToOne(() => AdminEntity, (AdminEntity) => AdminEntity.otp)
    admin: AdminEntity
}