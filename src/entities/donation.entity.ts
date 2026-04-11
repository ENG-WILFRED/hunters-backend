import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  donorName?: string;

  @Column({ nullable: true })
  mpesaReceipt?: string;

  @Column({ nullable: true })
  playerId?: string;

  @ManyToOne(() => Player, (p) => p.donations, { nullable: true })
  player?: Player;

  @CreateDateColumn()
  createdAt: Date;
}
