import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from '../balance/balance.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async saveWithNewBalance(user: User, balance: Balance): Promise<User> {
    const manager = this.usersRepository.manager;
    return manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(user);
        await transactionalEntityManager.save(balance);

        return user;
      },
    );
  }

  async getById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async getByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async getByEmailWithPassword(email: string): Promise<User> {
    return this.usersRepository.findOne({
      select: ['email', 'password', 'id'],
      where: {
        email,
      },
    });
  }
}
