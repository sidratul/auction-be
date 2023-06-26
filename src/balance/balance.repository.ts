import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from './balance.entity';

@Injectable()
export class BalanceRepository {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
  ) {}

  async getByUserId(userId: string): Promise<Balance> {
    return this.balanceRepository.findOneByOrFail({
      user: {
        id: userId,
      },
    });
  }

  async save(balance: Balance): Promise<Balance> {
    return this.balanceRepository.save(balance);
  }
}
