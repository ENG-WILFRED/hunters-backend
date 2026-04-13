import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import {
  CreateMatchDto,
  LeagueTableRowDto,
  MatchDto,
  StatisticsDto,
  UpdateMatchDto,
} from './dto/match.dto';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming matches' })
  @ApiOkResponse({ description: 'Upcoming matches', type: [MatchDto] })
  getUpcoming() {
    return this.matchesService.findUpcomingMatches();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recently finished matches' })
  @ApiOkResponse({ description: 'Recent matches', type: [MatchDto] })
  getRecent() {
    return this.matchesService.findRecentMatches();
  }

  @Get('league')
  @ApiOperation({ summary: 'Get league table standings' })
  @ApiOkResponse({ description: 'League table entries', type: [LeagueTableRowDto] })
  getLeagueTable() {
    return this.matchesService.getLeagueTable();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get team statistics summary' })
  @ApiOkResponse({ description: 'Team statistics summary', type: StatisticsDto })
  getStatistics(@Query('team') team?: string) {
    return this.matchesService.getTeamStatistics(team ?? 'Hunters FC');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new upcoming match' })
  @ApiCreatedResponse({ description: 'Match created', type: MatchDto })
  create(@Body() data: CreateMatchDto) {
    return this.matchesService.createMatch(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a match (typically to add final score)' })
  @ApiOkResponse({ description: 'Match updated', type: MatchDto })
  update(@Param('id') id: string, @Body() data: UpdateMatchDto) {
    return this.matchesService.updateMatch(id, data);
  }
}
