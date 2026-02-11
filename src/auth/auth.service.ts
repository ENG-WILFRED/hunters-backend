import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PlayersService } from '../players/players.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private players: PlayersService,
    private jwt: JwtService,
  ) {}

  async register(data: any) {
    // hash password
    const hashed = await bcrypt.hash(data.password, 10);
    const created = (await this.players.create({
      ...data,
      password: hashed,
    })) as any;
    const payload = { sub: created.id, isAdmin: !!created.isAdmin };
    return { access_token: this.jwt.sign(payload), user: created };
  }

  async validateUser(emailOrPhone: string, pass: string) {
    // find by email or phone
    const all = await this.players.findAll();
    const user = all.find(
      (u) => u.email === emailOrPhone || u.phone === emailOrPhone,
    );
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.password || '');
    if (!ok) return null;
    return user;
  }

  async login(emailOrPhone: string, pass: string) {
    const user = await this.validateUser(emailOrPhone, pass);
    if (!user) throw new UnauthorizedException();
    const payload = { sub: user.id, isAdmin: !!user.isAdmin };
    return { access_token: this.jwt.sign(payload), user };
  }
}
