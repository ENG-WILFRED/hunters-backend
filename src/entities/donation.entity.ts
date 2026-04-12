import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
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

  @ManyToOne(() => Player, (p) => p.donations, { nullable: true })
  @JoinColumn({ name: 'playerId' })
  player?: Player;

  @RelationId((donation: Donation) => donation.player)
  playerId?: string;

  @CreateDateColumn()
  createdAt: Date;
}
