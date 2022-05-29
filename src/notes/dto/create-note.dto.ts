/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}