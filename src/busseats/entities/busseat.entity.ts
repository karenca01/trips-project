import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Bus } from '../../buses/entities/bus.entity';
import { Tripseat } from '../../tripseats/entities/tripseat.entity';

@Entity('bus_seats')
export class Busseat {
	@PrimaryGeneratedColumn('uuid')
	busSeatId: string;

	@Column('uuid')
	busId: string;

	@Column({ length: 10 })
	seatNumber: string;

	@ManyToOne(() => Bus, (bus) => bus.seats, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'busId', referencedColumnName: 'busId' })
	bus: Bus;

	@OneToMany(() => Tripseat, (tripSeat) => tripSeat.busSeat)
	tripSeats: Tripseat[];
}
