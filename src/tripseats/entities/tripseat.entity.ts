import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';
import { Busseat } from '../../busseats/entities/busseat.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { User } from '../../auth/entities/user.entity';

export enum TripSeatStatus {
	FREE = 'free',
	RESERVED = 'reserved',
	BOOKED = 'booked',
}

@Entity('trip_seats')
export class Tripseat {
	@PrimaryGeneratedColumn('uuid')
	tripSeatId: string;

	@Column('uuid')
	tripId: string;

	@Column('uuid')
	busSeatId: string;

	@Column({ type: 'enum', enum: TripSeatStatus, default: TripSeatStatus.FREE })
	status: TripSeatStatus;

	@Column({ type: 'timestamp', nullable: true })
	reservedAt?: Date;

	@ManyToOne(() => User, { nullable: true })
	@JoinColumn({ name: 'reservedBy', referencedColumnName: 'userId' })
	reservedBy?: User;

	@ManyToOne(() => Trip, (trip) => trip.tripSeats, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'tripId', referencedColumnName: 'tripId' })
	trip: Trip;

	@ManyToOne(() => Busseat, (busSeat) => busSeat.tripSeats, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'busSeatId', referencedColumnName: 'busSeatId' })
	busSeat: Busseat;

	@OneToMany(() => Booking, (booking) => booking.tripSeat)
	bookings: Booking[];
}
