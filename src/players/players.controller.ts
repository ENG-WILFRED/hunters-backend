import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { DocumentsService } from '../documents/documents.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdateStatsDto } from './dto/update-stats.dto';

@ApiTags('Players')
@Controller('players')
export class PlayersController {
  constructor(
    private svc: PlayersService,
    private docs: DocumentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new player' })
  create(@Body() body: CreatePlayerDto) {
    return this.svc.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all players' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get player by ID' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(Number(id));
  }

  @Put(':id/stats')
  @ApiOperation({ summary: 'Update player match statistics' })
  updateStats(@Param('id') id: string, @Body() body: UpdateStatsDto) {
    return this.svc.updateStats(Number(id), body);
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@Param('id') id: string, @UploadedFile() file: any) {
    // accept multipart file, convert to base64 and store
    if (!file) return { ok: false };
    const b64 = file.buffer.toString('base64');
    return this.docs.create({
      filename: file.originalname,
      base64: b64,
      mime: file.mimetype,
      playerId: Number(id),
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a player' })
  remove(@Param('id') id: string) {
    return this.svc.remove(Number(id));
  }
}
