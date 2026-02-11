import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from '../entities/donation.entity';

@Injectable()
export class DonationsService {
  constructor(@InjectRepository(Donation) private repo: Repository<Donation>) {}

  create(data: Partial<Donation>) {
    const d = this.repo.create(data as any);
    return this.repo.save(d);
  }

  findAll() {
    return this.repo.find();
  }

  // MPesa stub: store a simulated receipt
  async mpesaCallback(payload: {
    amount: number;
    donorName?: string;
    receipt?: string;
  }) {
    const d = this.repo.create({
      amount: payload.amount,
      donorName: payload.donorName,
      mpesaReceipt: payload.receipt,
    });
    return this.repo.save(d);
  }
}
