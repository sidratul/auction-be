import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = dto.email;
    user.name = dto.name;
    user.password = dto.password;

    return this.usersRepository.save(user);
  }
}
