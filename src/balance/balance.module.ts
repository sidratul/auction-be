import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ItemModule } from 'src/item/item.module';
import { UserModule } from 'src/user/user.module';
import { BalanceService } from './balance.service';
import { BalanceRepository } from './balance.repository';
import { BalanceHistory } from './balanceHistory/balanceHistory.entity';
import { BalanceHistoryRepository } from './balanceHistory/balanceHistory.repository';
import { Balance } from './balance.entity';
import { BalanceHistoryService } from './balanceHistory/balanceHistory.service';
import { BalanceController } from './balance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Balance, BalanceHistory]),
    ItemModule,
    AuthModule,
    forwardRef(() => UserModule),
  ],
  providers: [
    BalanceService,
    BalanceRepository,
    BalanceHistoryService,
    BalanceHistoryRepository,
  ],
  controllers: [BalanceController],
  exports: [BalanceService],
})
export class BalanceModule {}
