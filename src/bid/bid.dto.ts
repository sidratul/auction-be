import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
  @Transform(({ value }) => {
    return Number(value);
  })
  @ApiProperty({ description: 'bid price' })
  readonly price: number;

  user: User;
}
