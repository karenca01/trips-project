import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Tripseat } from '../../tripseats/entities/tripseat.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('bookings')
export class Booking {
	@PrimaryGeneratedColumn('uuid')
	bookingId: string;

	@Column('uuid')
	tripSeatId: string;

	@Column('uuid')
	userId: string;

	@ManyToOne(() => Tripseat, (tripSeat) => tripSeat.bookings, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'tripSeatId', referencedColumnName: 'tripSeatId' })
	tripSeat: Tripseat;

	@ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
	user: User;
}
