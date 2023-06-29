import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Balance } from '../balance.entity';
import { BalanceHistoryStatus } from './balanceHistory.enum';

@Entity('balance_histories')
export class BalanceHistory {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'text' })
  description: string;

  @Column()
  @RelationId((history: BalanceHistory) => history.balance)
  @Index()
  balanceId: string;

  @ManyToOne(() => Balance, (balance) => balance.histories, {
    cascade: true,
  })
  balance: Promise<Balance>;

  @Column({
    type: 'enum',
    enum: BalanceHistoryStatus,
    default: BalanceHistoryStatus.BUY,
  })
  status: BalanceHistoryStatus;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updateAt?: Date;
}
