import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { BalanceHistory } from './balanceHistory/balanceHistory.entity';

@Entity('balances')
export class Balance {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ type: 'numeric', default: 0 })
  amount: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @OneToMany(() => BalanceHistory, (history) => history.balance)
  histories: Promise<BalanceHistory[]>;

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
