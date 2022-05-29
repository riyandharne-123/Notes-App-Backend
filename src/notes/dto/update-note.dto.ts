/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class UpdateNoteDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}