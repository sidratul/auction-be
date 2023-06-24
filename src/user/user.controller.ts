import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthToken } from '../auth/types';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getHello(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<AuthToken> {
    const user = await this.userService.createUser(createUserDto);
    return this.authService.getTokenFromUser(user);
  }
}
