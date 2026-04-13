import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { PlayersModule } from '../src/players/players.module';
import { DonationsModule } from '../src/donations/donations.module';
import { DocumentsModule } from '../src/documents/documents.module';
import { AuthModule } from '../src/auth/auth.module';
import { AdminModule } from '../src/admin/admin.module';
import { PostsModule } from '../src/posts/posts.module';
import { MatchesModule } from '../src/matches/matches.module';
import { Player } from '../src/entities/player.entity';
import { Document } from '../src/entities/document.entity';
import { Donation } from '../src/entities/donation.entity';
import { Post as BlogPost } from '../src/entities/post.entity';
import { Fixture } from '../src/entities/fixture.entity';

jest.setTimeout(20000);

describe('API Endpoints (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let playerId: string;
  let documentId: string;
  let postId: string;
  let fixtureRepo: Repository<Fixture>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Player, Document, Donation, BlogPost, Fixture],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([Fixture]),
        PlayersModule,
        DonationsModule,
        DocumentsModule,
        AuthModule,
        AdminModule,
        PostsModule,
        MatchesModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    fixtureRepo = moduleFixture.get<Repository<Fixture>>(getRepositoryToken(Fixture));
    await fixtureRepo.save([
      {
        homeTeam: 'Hunters FC',
        awayTeam: 'Rugongo',
        homeScore: 1,
        awayScore: 0,
        kickOff: new Date(Date.now() - 24 * 60 * 60 * 1000),
        venue: 'Weru Stadium',
        status: 'Finished',
      },
      {
        homeTeam: 'Hunters FC',
        awayTeam: 'Munchez Boys',
        homeScore: null,
        awayScore: null,
        kickOff: new Date(Date.now() + 24 * 60 * 60 * 1000),
        venue: 'Weru Stadium',
        status: 'Upcoming',
      },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / returns Hello World!', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('POST /players creates a player', async () => {
    const response = await request(app.getHttpServer())
      .post('/players')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        position: 'MID',
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.firstName).toBe('John');
    playerId = response.body.id;
  });

  it('GET /players returns created player', async () => {
    const response = await request(app.getHttpServer())
      .get('/players')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /players/:id returns the player', async () => {
    const response = await request(app.getHttpServer())
      .get(`/players/${playerId}`)
      .expect(200);

    expect(response.body.id).toBe(playerId);
    expect(response.body.email).toBe('john@example.com');
  });

  it('PUT /players/:id/stats updates player statistics', async () => {
    const response = await request(app.getHttpServer())
      .put(`/players/${playerId}/stats`)
      .send({ matchesPlayed: 5, goals: 2, assists: 1 })
      .expect(200);

    expect(response.body.matchesPlayed).toBe(5);
    expect(response.body.goals).toBe(2);
    expect(response.body.assists).toBe(1);
  });

  it('POST /players/:id/documents accepts a file upload', async () => {
    const response = await request(app.getHttpServer())
      .post(`/players/${playerId}/documents`)
      .attach('file', Buffer.from('test file content'), 'resume.txt')
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.filename).toBe('resume.txt');
  });

  it('DELETE /players/:id removes the player', async () => {
    await request(app.getHttpServer()).delete(`/players/${playerId}`).expect(200);
  });

  it('POST /documents creates a document directly', async () => {
    const response = await request(app.getHttpServer())
      .post('/documents')
      .send({
        filename: 'manual.txt',
        base64: Buffer.from('manual content').toString('base64'),
      })
      .expect(201);

    expect(response.body.filename).toBe('manual.txt');
    documentId = response.body.id;
  });

  it('GET /documents returns documents', async () => {
    const response = await request(app.getHttpServer()).get('/documents').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /documents/:id/download returns binary content', async () => {
    await request(app.getHttpServer())
      .get(`/documents/${documentId}/download`)
      .expect(200)
      .expect('content-type', /octet-stream|text\/plain/);
  });

  it('POST /donations creates a donation', async () => {
    const response = await request(app.getHttpServer())
      .post('/donations')
      .send({ amount: 50.5, donorName: 'Jane Doe' })
      .expect(201);

    expect(Number(response.body.amount)).toBeCloseTo(50.5);
  });

  it('GET /donations returns donations', async () => {
    const response = await request(app.getHttpServer()).get('/donations').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /donations/mpesa/callback stores a callback', async () => {
    const response = await request(app.getHttpServer())
      .post('/donations/mpesa/callback')
      .send({ amount: 100, donorName: 'Mpesa User', receipt: 'ABC123' })
      .expect(201);

    expect(response.body.mpesaReceipt).toBe('ABC123');
  });

  it('POST /auth/register creates a user and returns a token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
      })
      .expect(201);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.user).toBeDefined();
    adminToken = response.body.access_token;
  });

  it('POST /auth/login returns a JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ emailOrPhone: 'admin@example.com', password: 'password123' })
      .expect(201);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.user.email).toBe('admin@example.com');
  });

  it('POST /posts creates a post', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send({ name: 'Poster', message: 'Hello world' })
      .expect(201);

    expect(response.body.id).toBeDefined();
    postId = response.body.id;
  });

  it('GET /posts returns stored posts', async () => {
    const response = await request(app.getHttpServer()).get('/posts').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((post: any) => post.id === postId)).toBe(true);
  });

  it('GET /posts/:id returns the post', async () => {
    const response = await request(app.getHttpServer()).get(`/posts/${postId}`).expect(200);
    expect(response.body.id).toBe(postId);
    expect(response.body.name).toBe('Poster');
  });

  it('PUT /posts/:id updates the post', async () => {
    await request(app.getHttpServer())
      .put(`/posts/${postId}`)
      .send({ message: 'Updated message' })
      .expect(200);

    const response = await request(app.getHttpServer()).get(`/posts/${postId}`).expect(200);
    expect(response.body.message).toBe('Updated message');
  });

  it('DELETE /posts/:id removes the post', async () => {
    await request(app.getHttpServer()).delete(`/posts/${postId}`).expect(200);
  });

  it('GET /admin/players is protected and returns players for admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/admin/players')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /admin/documents is protected and returns documents', async () => {
    await request(app.getHttpServer())
      .get('/admin/documents')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('GET /admin/donations is protected and returns donations', async () => {
    await request(app.getHttpServer())
      .get('/admin/donations')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('GET /matches/upcoming returns upcoming matches', async () => {
    const response = await request(app.getHttpServer())
      .get('/matches/upcoming')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((match: any) => match.awayTeam === 'Munchez Boys')).toBe(true);
  });

  it('GET /matches/recent returns recent finished matches', async () => {
    const response = await request(app.getHttpServer())
      .get('/matches/recent')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((match: any) => match.homeTeam === 'Hunters FC')).toBe(true);
  });

  it('GET /matches/league returns league table entries', async () => {
    const response = await request(app.getHttpServer()).get('/matches/league').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toMatchObject({
      team: 'Hunters FC',
      played: 1,
      wins: 1,
      draws: 0,
      losses: 0,
      goalDifference: 1,
      points: 3,
    });
  });

  it('GET /matches/statistics returns team statistics summary', async () => {
    const response = await request(app.getHttpServer()).get('/matches/statistics').expect(200);

    expect(response.body).toMatchObject({
      wins: 1,
      goalsScored: 1,
      goalsConceded: 0,
      homeWins: 1,
    });
  });

  it('POST /matches creates a new upcoming match', async () => {
    const response = await request(app.getHttpServer())
      .post('/matches')
      .send({
        homeTeam: 'Hunters Junior',
        awayTeam: 'Weru',
        kickOff: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        venue: 'Kanamba Ground',
        status: 'Friendly',
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.homeTeam).toBe('Hunters Junior');
    expect(response.body.awayTeam).toBe('Weru');
  });

  it('PUT /matches/:id updates a match with final score', async () => {
    const upcoming = await request(app.getHttpServer()).get('/matches/upcoming');
    const upcomingMatch = upcoming.body[0];

    const response = await request(app.getHttpServer())
      .put(`/matches/${upcomingMatch.id}`)
      .send({
        homeScore: 2,
        awayScore: 1,
      })
      .expect(200);

    expect(response.body.homeScore).toBe(2);
    expect(response.body.awayScore).toBe(1);
    expect(response.body.status).toBe('Finished');
  });

  it('GET /matches/recent includes updated match after scoring', async () => {
    const response = await request(app.getHttpServer())
      .get('/matches/recent')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
    expect(response.body.some((match: any) => match.homeTeam === 'Hunters FC' && match.awayTeam === 'Munchez Boys')).toBe(true);
  });

  it('GET /matches/league correctly calculates standings from finished matches', async () => {
    const response = await request(app.getHttpServer())
      .get('/matches/league')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
    
    const huntersFC = response.body.find((row: any) => row.team === 'Hunters FC');
    expect(huntersFC).toBeDefined();
    expect(huntersFC.played).toBeGreaterThanOrEqual(1);
    expect(huntersFC.wins).toBeGreaterThanOrEqual(1);
  });
});
