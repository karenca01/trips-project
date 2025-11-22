import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Busseat } from '../../busseats/entities/busseat.entity';
import { Trip } from '../../trips/entities/trip.entity';

@Entity('buses')
export class Bus {
	@PrimaryGeneratedColumn('uuid')
	busId: string;

	@Column({ length: 100 })
	busName: string;

	@OneToMany(() => Busseat, (seat) => seat.bus)
	seats: Busseat[];

	@OneToMany(() => Trip, (trip) => trip.bus)
	trips: Trip[];
}
