import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { Player } from '../entities/player.entity';
import { InjectRepository as InjectPlayerRepo } from '@nestjs/typeorm';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private repo: Repository<Document>,
    @InjectRepository(Player) private playerRepo: Repository<Player>,
  ) {}

  async create(data: { filename: string; base64: string; mime?: string; playerId?: number }) {
    const doc = this.repo.create({ filename: data.filename, base64: data.base64, mime: data.mime });
    if (data.playerId) {
      const p = await this.playerRepo.findOne({ where: { id: data.playerId } });
      if (p) doc.player = p;
    }
    return this.repo.save(doc);
  }

  findAll() {
    return this.repo.find({ relations: ['player'] });
  }

  async findOne(id: number) {
    const d = await this.repo.findOne({ where: { id }, relations: ['player'] });
    if (!d) throw new NotFoundException('Document not found');
    return d;
  }

  async download(id: number) {
    const d = await this.findOne(id);
    const buffer = Buffer.from(d.base64, 'base64');
    return { buffer, filename: d.filename, mime: d.mime || 'application/octet-stream' };
  }
}
