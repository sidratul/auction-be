import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Email' })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Name' })
  readonly name: string;

  @IsNotEmpty()
  @MinLength(6)
  /** TODO: check password strongness */
  @ApiProperty({ description: 'Password' })
  readonly password: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: 'Confirmation Password' })
  /** TODO: create validator to validate password and confirmPassword */
  readonly confirmPassword: string;
}
