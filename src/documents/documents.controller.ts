import { Controller, Get, Param, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Response } from 'express';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private svc: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a document (as base64)' })
  create(@Body() body: CreateDocumentDto) {
    return this.svc.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all documents' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download a document (regenerate from base64)' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const result = await this.svc.download(Number(id));
    res.setHeader('Content-Type', result.mime);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.buffer);
  }
}
