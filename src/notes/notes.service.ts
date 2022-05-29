/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//services
import { RedisService } from '../redis/redis.service';

//schema
import { Note, NoteDocument } from './note.schema';

//dtos
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private redisService: RedisService
  ){}

  async create(req, createNoteDto: CreateNoteDto) {
    createNoteDto['user_id'] = req.user._id;
    const note = await new this.noteModel(createNoteDto).save();
    await this.redisService.deleteQuery('notes_' + note.user_id);
    await this.redisService.setObject('note_' + note._id, note)
    return note;
  }

  async findAll(req) {
    const user_id = req.user._id;

    const cachedNotes = await this.redisService.getQuery('notes_' + user_id, req)

    if(cachedNotes != null) {
      return cachedNotes
   }

    const options = {};

    if(req.query.search != null && req.query.search != '') {
      options['title'] = new RegExp(req.query.search.toString());
    }

    options['user_id'] = user_id;

    const page: number = req.query.page != null ? parseInt(req.query.page) : 1;
    const limit = 4;

    const notes = await this.noteModel.find()
    .where(options)
    .sort({
      createdAt: 'desc'
    })
    .skip((page - 1 ) * limit)
    .limit(limit)
    .exec()

    const total = await this.noteModel.find()
    .where(options)
    .sort({
      createdAt: 'desc'
    })
    .count()

    const data = {
      'notes': notes,
      'page': page,
      'last_page': Math.ceil(total / 4),
      'total': total
    };

    await this.redisService.setQuery('notes_' + user_id, req, notes);

    return data;
  }

  async findOne(id: string) {
    const cachedNote = await this.redisService.getObject('note_' + id)

    if(cachedNote != null) {
      return cachedNote
    }

    const note = await this.noteModel.findOne()
    .where({
      _id: id
    })
    .exec()

    if(note == null) {
      return new UnauthorizedException('Note does not exist.');
    }

    await this.redisService.setObject('note_' + id, note)

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const note = await this.noteModel.findOne()
    .where({
      _id: id
    })
    .exec()

    if(note == null) {
      return new UnauthorizedException('Note does not exist.');
    }

    note.title = updateNoteDto.title;
    note.description = updateNoteDto.description;
    await note.save();

    await this.redisService.deleteQuery('notes_' + note.user_id);

    await this.redisService.setObject('note_' + id, note)

    return note;
  }

  async remove(id: string) {
    const note = await this.noteModel.findOne()
    .where({
      _id: id
    })
    .exec()

    if(note == null) {
      return new UnauthorizedException('Note does not exist.');
    }

    await this.redisService.deleteQuery('notes_' + note.user_id);

    await note.delete();

    await this.redisService.deleteObject('note_' + id)

    return 'Note deleted.'
  }
}
