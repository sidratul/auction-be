import { BalanceHistoryStatus } from './balanceHistory.enum';

export interface AddBalanceHistory {
  description: string;
  status: BalanceHistoryStatus;
  amount: number;
}
