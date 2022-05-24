import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterKeyDto {
  @IsNotEmpty()
  @IsString()
  value: string;
}
