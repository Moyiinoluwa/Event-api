import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

export interface IUserOtp {
    id: number;
    email: string;
    otp: string;
    verified: boolean;
    createdAt: Date;
    expirationTime: Date;
}


@Entity({ name: 'userOtp'})
    export class UserOtp implements IUserOtp {
        @PrimaryGeneratedColumn()
        id: number;

        @Column({ unique: true})
        email: string;

        @Column()
        otp: string;

        @Column({ type: 'boolean', default: false })
        verified: boolean;

        @Column()
        expirationTime: Date;

        @CreateDateColumn({ type: 'timestamp'})
        createdAt: Date;

        @OneToOne(() => UserEntity, (UserEntity) => UserEntity.otp)
        user: UserEntity
    }