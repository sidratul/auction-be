import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthToken } from '../auth/types';
import { AuthGuard } from '../auth/auth.guard';
import { UserContext } from '../auth/auth.decorator';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<AuthToken> {
    const user = await this.userService.createUser(createUserDto);
    return this.authService.getTokenFromUser(user);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@UserContext() user: User): Promise<User> {
    return user;
  }
}
