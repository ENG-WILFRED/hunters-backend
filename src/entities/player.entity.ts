import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from './document.entity';
import { Donation } from './donation.entity';

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 'MID' })
  position: Position;

  @Column({ default: 0 })
  matchesPlayed: number;

  @Column({ default: 0 })
  goals: number;

  @Column({ default: 0 })
  assists: number;

  @OneToMany(() => Document, (doc) => doc.player, { cascade: true })
  documents: Document[];

  @OneToMany(() => Donation, (d) => d.player)
  donations: Donation[];

  getRating(): number {
    // simple rating formula
    if (this.matchesPlayed <= 0) return 0;
    return (
      Math.round(
        ((this.goals * 4 + this.assists * 3) / this.matchesPlayed) * 10,
      ) / 10
    );
  }
}
