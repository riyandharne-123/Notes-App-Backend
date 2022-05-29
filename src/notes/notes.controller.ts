/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Request, Put, Param, Delete, UseGuards } from '@nestjs/common';

//services
import { NotesService } from './notes.service'
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';

//dtos
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Request() req, @Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(req, createNoteDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.notesService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
