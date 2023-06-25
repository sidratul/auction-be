import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @ApiProperty({ description: 'startprice' })
  readonly startPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Time in seconds' })
  readonly time: number;

  user: User;
}
