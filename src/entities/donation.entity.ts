import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Donation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  donorName?: string;

  @Column({ nullable: true })
  mpesaReceipt?: string;

  @ManyToOne(() => Player, (p) => p.donations, { nullable: true })
  player?: Player;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
