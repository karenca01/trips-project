import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Route } from '../../routes/entities/route.entity';
import { Bus } from '../../buses/entities/bus.entity';
import { Tripseat } from '../../tripseats/entities/tripseat.entity';

@Entity('trips')
export class Trip {
	@PrimaryGeneratedColumn('uuid')
	tripId: string;

	@Column('uuid')
	routeId: string;

	@Column('uuid')
	busId: string;

	@Column({ type: 'date' })
	tripDate: Date;

	@Column({ type: 'time' })
	tripTime: string;

	@Column('decimal', { precision: 10, scale: 2 })
	tripPrice: number;

	@ManyToOne(() => Route, (route) => route.trips, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'routeId', referencedColumnName: 'routeId' })
	route: Route;

	@ManyToOne(() => Bus, (bus) => bus.trips, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'busId', referencedColumnName: 'busId' })
	bus: Bus;

	@OneToMany(() => Tripseat, (tripSeat) => tripSeat.trip)
	tripSeats: Tripseat[];
}
