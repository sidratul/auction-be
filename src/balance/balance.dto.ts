import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from '../user/user.entity';

export class BalanceDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  @ApiProperty({ description: 'amount' })
  readonly amount: number;

  user: User;
  description?: string;
}
