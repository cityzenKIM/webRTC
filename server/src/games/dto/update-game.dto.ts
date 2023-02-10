import { IsString } from 'class-validator';

export class UpdateGameDto {
  @IsString()
  readonly name: string;
}
