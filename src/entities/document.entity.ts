import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column('text')
  base64: string;

  @Column({ nullable: true })
  playerId?: string;

  @ManyToOne(() => Player, (p) => p.documents, { onDelete: 'CASCADE' })
  player: Player;

  @Column({ nullable: true })
  mime?: string;
}
