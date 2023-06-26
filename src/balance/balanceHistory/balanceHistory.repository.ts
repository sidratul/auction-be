import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceHistory } from './balanceHistory.entity';

@Injectable()
export class BalanceHistoryRepository {
  constructor(
    @InjectRepository(BalanceHistory)
    private readonly historyRepository: Repository<BalanceHistory>,
  ) {}

  async save(item: BalanceHistory): Promise<BalanceHistory> {
    return this.historyRepository.save(item);
  }
}
