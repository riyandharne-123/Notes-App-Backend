/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true})
export class Note {
  @Prop()
  user_id: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  createdAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);