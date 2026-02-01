import { Controller, Get, Param, Put, Body, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlayersService } from '../players/players.service';
import { DocumentsService } from '../documents/documents.service';
import { DonationsService } from '../donations/donations.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private players: PlayersService, private docs: DocumentsService, private dons: DonationsService) {}

  @Get('players')
  @ApiOperation({ summary: 'List players (admin)' })
  listPlayers() {
    return this.players.findAll();
  }

  @Put('players/:id')
  @ApiOperation({ summary: 'Edit player (admin)' })
  editPlayer(@Param('id') id: string, @Body() body: any) {
    return this.players.updateStats(Number(id), body);
  }

  @Delete('players/:id')
  @ApiOperation({ summary: 'Delete player (admin)' })
  deletePlayer(@Param('id') id: string) {
    return this.players.remove(Number(id));
  }

  @Get('documents')
  @ApiOperation({ summary: 'List documents (admin)' })
  listDocs() {
    return this.docs.findAll();
  }

  @Get('donations')
  @ApiOperation({ summary: 'List donations (admin)' })
  listDonations() {
    return this.dons.findAll();
  }
}
