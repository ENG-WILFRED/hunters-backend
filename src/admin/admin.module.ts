import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PlayersModule } from '../players/players.module';
import { DocumentsModule } from '../documents/documents.module';
import { DonationsModule } from '../donations/donations.module';

@Module({
  imports: [PlayersModule, DocumentsModule, DonationsModule],
  controllers: [AdminController],
})
export class AdminModule {}
