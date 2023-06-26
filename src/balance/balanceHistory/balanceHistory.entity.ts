import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';
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

  @Column()
  @RelationId((history: BalanceHistory) => history.balance)
  @Index()
  userId: string;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

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
