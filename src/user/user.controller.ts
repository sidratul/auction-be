import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getHello(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    await this.userService.createUser(createUserDto);
    return true;
  }
}
