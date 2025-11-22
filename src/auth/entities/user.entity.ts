import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ length: 100 })
    userName: string;

    @Column({ length: 100, unique: true })
    userEmail: string;

    @Column({ length: 256 })
    userPassword: string;

    @Column({ length: 100, nullable: true })
    userDocument?: string;

    @Column({ default: false })
    userVerified: boolean;

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings?: Booking[];
}