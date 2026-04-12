import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column('text')
  base64: string;

  @ManyToOne(() => Player, (p) => p.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @RelationId((document: Document) => document.player)
  playerId?: string;

  @Column({ nullable: true })
  mime?: string;
}
