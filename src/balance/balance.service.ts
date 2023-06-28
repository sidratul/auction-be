import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Balance } from './balance.entity';
import { BalanceRepository } from './balance.repository';
import { User } from '../user/user.entity';
import { BalanceHistoryStatus } from './balanceHistory/balanceHistory.enum';
import { BalanceHistoryService } from './balanceHistory/balanceHistory.service';
import { BalanceDto } from './balance.dto';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    private balanceRepository: BalanceRepository,
    private balanceHistoryService: BalanceHistoryService,
  ) {}

  async createBalance(user: User): Promise<Balance> {
    const balance = this.createBalanceObj(user);

    return this.balanceRepository.save(balance).catch((err) => {
      this.logger.error(`Error creating balance. Error: ${err.message}`);
      throw new InternalServerErrorException();
    });
  }

  createBalanceObj(user: User): Balance {
    const balance = new Balance();
    balance.user = Promise.resolve(user);

    return balance;
  }

  async deposit(dto: BalanceDto): Promise<Balance> {
    return this.addBalanceHistory(dto, BalanceHistoryStatus.DEPOSIT);
  }

  async buy(dto: BalanceDto): Promise<Balance> {
    return this.addBalanceHistory(dto, BalanceHistoryStatus.DEPOSIT);
  }

  async refund(dto: BalanceDto): Promise<Balance> {
    return this.addBalanceHistory(dto, BalanceHistoryStatus.DEPOSIT);
  }

  async addBalanceHistory(
    dto: BalanceDto,
    status: BalanceHistoryStatus,
  ): Promise<Balance> {
    const balance = await this.getByUserId(dto.user.id);
    const balanceHistory = await this.balanceHistoryService.addBalanceHistory(
      balance,
      {
        status,
        amount: dto.amount,
        description: dto.description,
      },
    );

    return balanceHistory.balance;
  }

  async getByUserId(userId: string): Promise<Balance> {
    return this.balanceRepository.getByUserId(userId).catch(() => {
      this.logger.warn(`No balance found for user id: ${userId}`);
      throw new BadRequestException();
    });
  }
}
