import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fixture' })
export class Fixture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  homeTeam: string;

  @Column()
  awayTeam: string;

  @Column({ type: 'int', nullable: true })
  homeScore?: number;

  @Column({ type: 'int', nullable: true })
  awayScore?: number;

  @Column()
  kickOff: Date;

  @Column()
  venue: string;

  @Column({ default: 'Friendly' })
  status: string;
}
