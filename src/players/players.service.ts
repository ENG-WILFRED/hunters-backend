import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(@InjectRepository(Player) private repo: Repository<Player>) {}

  create(data: Partial<Player>) {
    const p = this.repo.create(data as any);
    return this.repo.save(p);
  }

  findAll() {
    return this.repo.find({ relations: ['documents', 'donations'] });
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id }, relations: ['documents', 'donations'] });
    if (!p) throw new NotFoundException('Player not found');
    return p;
  }

  async updateStats(id: number, stats: Partial<Player>) {
    const p = await this.findOne(id);
    Object.assign(p, stats);
    return this.repo.save(p);
  }

  async remove(id: number) {
    const p = await this.findOne(id);
    return this.repo.remove(p);
  }
}
