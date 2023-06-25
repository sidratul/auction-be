import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, Min } from 'class-validator';
import { ItemStatus } from '../item.enum';
import { Optional } from '@nestjs/common';

export class ListItemDto {
  @ApiProperty({
    description: 'Page',
    type: Number,
  })
  @IsNumber()
  @Min(1)
  page = 1;

  @ApiProperty({
    description: 'Limit',
    type: Number,
  })
  @IsNumber()
  limit = 10;

  @ApiProperty({
    description: 'List of status',
    isArray: true,
    enum: ItemStatus,
  })
  @IsArray()
  @IsEnum(ItemStatus, { each: true })
  status: ItemStatus[];

  @ApiProperty({ description: 'User ID (uuid)' })
  @Optional()
  userId: string;
}
