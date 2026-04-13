import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fixture } from '../entities/fixture.entity';
import { CreateMatchDto, UpdateMatchDto } from './dto/match.dto';

@Injectable()
export class MatchesService {
  constructor(@InjectRepository(Fixture) private repo: Repository<Fixture>) {}

  findUpcomingMatches() {
    return this.repo
      .createQueryBuilder('fixture')
      .where('fixture.status = :status', { status: 'Upcoming' })
      .orWhere(
        '(fixture.kickOff >= :now AND fixture.status NOT IN (:finished, :postponed))',
        { now: new Date().toISOString(), finished: 'Finished', postponed: 'Postponed' },
      )
      .orderBy('fixture.kickOff', 'ASC')
      .getMany();
  }

  findRecentMatches() {
    return this.repo
      .createQueryBuilder('fixture')
      .where('fixture.status = :status', { status: 'Finished' })
      .andWhere('fixture.homeScore IS NOT NULL')
      .andWhere('fixture.awayScore IS NOT NULL')
      .orderBy('fixture.kickOff', 'DESC')
      .getMany();
  }

  async getLeagueTable() {
    const matches = await this.repo
      .createQueryBuilder('fixture')
      .where('fixture.status = :status', { status: 'Finished' })
      .andWhere('fixture.homeScore IS NOT NULL')
      .andWhere('fixture.awayScore IS NOT NULL')
      .getMany();

    const table = new Map<
      string,
      {
        played: number;
        wins: number;
        draws: number;
        losses: number;
        goalsFor: number;
        goalsAgainst: number;
      }
    >();

    const ensureTeam = (team: string) => {
      if (!table.has(team)) {
        table.set(team, {
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
        });
      }
      return table.get(team)!;
    };

    for (const match of matches) {
      const home = ensureTeam(match.homeTeam);
      const away = ensureTeam(match.awayTeam);

      home.played += 1;
      away.played += 1;

      home.goalsFor += match.homeScore ?? 0;
      home.goalsAgainst += match.awayScore ?? 0;
      away.goalsFor += match.awayScore ?? 0;
      away.goalsAgainst += match.homeScore ?? 0;

      if ((match.homeScore ?? 0) > (match.awayScore ?? 0)) {
        home.wins += 1;
        away.losses += 1;
      } else if ((match.homeScore ?? 0) < (match.awayScore ?? 0)) {
        away.wins += 1;
        home.losses += 1;
      } else {
        home.draws += 1;
        away.draws += 1;
      }
    }

    const rows = Array.from(table.entries()).map(([team, stats]) => ({
      team,
      played: stats.played,
      wins: stats.wins,
      draws: stats.draws,
      losses: stats.losses,
      goalDifference: stats.goalsFor - stats.goalsAgainst,
      points: stats.wins * 3 + stats.draws,
      goalsFor: stats.goalsFor,
    }));

    rows.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference)
        return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.localeCompare(b.team);
    });

    return rows.map((row, index) => ({
      position: index + 1,
      team: row.team,
      played: row.played,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      goalDifference: row.goalDifference,
      points: row.points,
    }));
  }

  async getTeamStatistics(team = 'Hunters FC') {
    const matches = await this.repo
      .createQueryBuilder('fixture')
      .where('(fixture.homeTeam = :team OR fixture.awayTeam = :team)', { team })
      .andWhere('fixture.status = :status', { status: 'Finished' })
      .andWhere('fixture.homeScore IS NOT NULL')
      .andWhere('fixture.awayScore IS NOT NULL')
      .getMany();

    return matches.reduce(
      (stats, match) => {
        const isHome = match.homeTeam === team;
        const scored = isHome ? match.homeScore ?? 0 : match.awayScore ?? 0;
        const conceded = isHome ? match.awayScore ?? 0 : match.homeScore ?? 0;

        stats.goalsScored += scored;
        stats.goalsConceded += conceded;

        if (isHome) {
          if ((match.homeScore ?? 0) > (match.awayScore ?? 0)) {
            stats.wins += 1;
            stats.homeWins += 1;
          }
        }

        if (!isHome && (match.awayScore ?? 0) > (match.homeScore ?? 0)) {
          stats.wins += 1;
        }

        return stats;
      },
      {
        wins: 0,
        goalsScored: 0,
        goalsConceded: 0,
        homeWins: 0,
      },
    );
  }

  async createMatch(data: CreateMatchDto) {
    const fixture = this.repo.create({
      ...data,
      status: data.status ?? 'Friendly',
    });
    return this.repo.save(fixture);
  }

  async updateMatch(id: string, data: UpdateMatchDto) {
    const fixture = await this.repo.findOne({ where: { id } });
    if (!fixture) throw new NotFoundException('Match not found');
    
    // Auto-mark as Finished if both scores are provided
    if (data.homeScore !== undefined && data.awayScore !== undefined) {
      data.status = 'Finished';
    }
    
    Object.assign(fixture, data);
    return this.repo.save(fixture);
  }
}
