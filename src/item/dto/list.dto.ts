import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { ItemStatus } from '../item.enum';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';

export class ListItemDto {
  @ApiProperty({
    description: 'Page',
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page = 1;

  @ApiProperty({
    description: 'Limit',
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  limit = 10;

  @IsOptional()
  @ApiProperty({
    description: 'List of status',
    isArray: true,
    enum: ItemStatus,
  })
  @IsArray()
  @IsEnum(ItemStatus, { each: true })
  status: ItemStatus[];

  @IsOptional()
  @IsUUID('4')
  @ApiProperty({ description: 'User ID (uuid)' })
  @Optional()
  userId: string;
}
