import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';

@Entity('routes')
export class Route {
	@PrimaryGeneratedColumn('uuid')
	routeId: string;

	@Column({ length: 100 })
	routeOrigin: string;

	@Column({ length: 100 })
	routeDestination: string;

	@OneToMany(() => Trip, (trip) => trip.route)
	trips: Trip[];
}
