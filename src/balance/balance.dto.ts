import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from '../user/user.entity';

export class BalanceDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'amount' })
  readonly amount: number;

  user: User;
  description?: string;
}
