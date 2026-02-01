import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from '../entities/donation.entity';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { MpesaService } from './mpesa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donation])],
  controllers: [DonationsController],
  providers: [DonationsService, MpesaService],
  exports: [DonationsService, MpesaService],
})
export class DonationsModule {}
