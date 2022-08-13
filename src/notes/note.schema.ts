/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/user.schema';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } })
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

NoteSchema.virtual('user', {
  ref: User.name,
  localField: 'user_id',
  foreignField: '_id',
  justOne: true
})