import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new player (or admin if isAdmin=true)' })
  register(@Body() body: RegisterDto) {
    return this.auth.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login (email or phone + password)' })
  login(@Body() body: LoginDto) {
    return this.auth.login(body.emailOrPhone, body.password);
  }
}
