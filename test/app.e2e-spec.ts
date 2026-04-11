import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { PlayersModule } from '../src/players/players.module';
import { DonationsModule } from '../src/donations/donations.module';
import { DocumentsModule } from '../src/documents/documents.module';
import { AuthModule } from '../src/auth/auth.module';
import { AdminModule } from '../src/admin/admin.module';
import { PostsModule } from '../src/posts/posts.module';
import { Player } from '../src/entities/player.entity';
import { Document } from '../src/entities/document.entity';
import { Donation } from '../src/entities/donation.entity';
import { Post as BlogPost } from '../src/entities/post.entity';

jest.setTimeout(20000);

describe('API Endpoints (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let playerId: number;
  let documentId: number;
  let postId: number;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Player, Document, Donation, BlogPost],
          synchronize: true,
          logging: false,
        }),
        PlayersModule,
        DonationsModule,
        DocumentsModule,
        AuthModule,
        AdminModule,
        PostsModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
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
});
