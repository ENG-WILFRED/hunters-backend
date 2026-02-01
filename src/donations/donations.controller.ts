import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';

@ApiTags('Donations')
@Controller('donations')
export class DonationsController {
  constructor(private svc: DonationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a donation' })
  create(@Body() body: CreateDonationDto) {
    return this.svc.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all donations' })
  findAll() {
    return this.svc.findAll();
  }

  @Post('mpesa/callback')
  @ApiOperation({ summary: 'MPesa payment callback' })
  mpesaCallback(@Body() body: any) {
    return this.svc.mpesaCallback(body);
  }
}
