import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../../user/user.entity';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'name' })
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => {
    return Number(value);
  })
  @ApiProperty({ description: 'startprice' })
  readonly startPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => {
    return Number(value);
  })
  @ApiProperty({ description: 'Time in seconds' })
  readonly time: number;

  user: User;
}
