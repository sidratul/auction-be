import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BalanceHistoryRepository } from './balanceHistory.repository';
import { AddBalanceHistory } from './types';
import { BalanceHistory } from './balanceHistory.entity';
import { Balance } from '../balance.entity';
import { BalanceHistoryStatus } from './balanceHistory.enum';

@Injectable()
export class BalanceHistoryService {
  private readonly logger = new Logger(BalanceHistoryService.name);

  constructor(private historyRepository: BalanceHistoryRepository) {}

  addBalanceHistory(
    balance: Balance,
    params: AddBalanceHistory,
  ): Promise<BalanceHistory> {
    const balanceHistory = new BalanceHistory();
    if (balanceHistory.status === BalanceHistoryStatus.BUY) {
      balance.amount -= params.amount;
    } else {
      balance.amount += params.amount;
    }

    if (balance.amount < 0) {
      this.logger.error(`Balance amount with negative value`);
      throw new BadRequestException();
    }

    balanceHistory.amount = params.amount;
    balanceHistory.balance = Promise.resolve(balance);
    balanceHistory.status = params.status;
    balanceHistory.description = params.description;

    return this.historyRepository.save(balanceHistory).catch((err) => {
      this.logger.error(`Error save balance history. Error: ${err.message}`);
      throw new InternalServerErrorException();
    });
  }
}
