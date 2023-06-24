import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    // check if user exists
    const existsUser = await this.findByEmail(dto.email);
    if (existsUser) {
      throw new BadRequestException('User exists');
    }

    const user = new User();
    user.email = dto.email;
    user.name = dto.name;
    user.password = await bcrypt.hash(
      dto.password,
      this.configService.get('SALT'),
    );

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findByEmail(email);
  }

  async isPasswordMatch(user: User, password): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}
