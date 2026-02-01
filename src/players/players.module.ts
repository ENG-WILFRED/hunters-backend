import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { DocumentsModule } from '../documents/documents.module';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), DocumentsModule],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
