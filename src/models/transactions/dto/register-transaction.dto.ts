import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class RegisterTransactionDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;
}
