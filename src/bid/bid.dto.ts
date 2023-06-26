import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { User } from '../user/user.entity';

export class CreateBidDto {
  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty({ description: 'item id' })
  readonly itemId: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'bid price' })
  readonly price: number;

  user: User;
}
