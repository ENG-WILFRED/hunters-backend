import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  filename: string;

  @Column('text')
  base64: string;

  @ManyToOne(() => Player, (p) => p.documents, { onDelete: 'CASCADE' })
  player: Player;

  @Column({ nullable: true })
  mime?: string;
}
