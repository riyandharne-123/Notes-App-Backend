/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//schema
import { Note, NoteDocument } from './note.schema';

//dtos
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>
  ){}

  async create(req, createNoteDto: CreateNoteDto) {
    createNoteDto['user_id'] = req.user._id;
    const note = await new this.noteModel(createNoteDto).save();
    return note;
  }

  async findAll(req) {
    const user_id = req.user._id;
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

    return data;
  }

  async findOne(id: string) {
    const note = await this.noteModel.findOne()
    .where({
      _id: id
    })
    .exec()

    if(note == null) {
      return new UnauthorizedException('Note does not exist.');
    }

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

    await note.delete();

    return 'Note deleted.'
  }
}
