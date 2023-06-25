import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemStatus } from './item.enum';
import { User } from '../user/user.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  /**
   * save time in second
   */
  @Column({ type: 'numeric' })
  time: number;

  @Column({ type: 'numeric' })
  startPrice: number;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.CREATED,
  })
  status: ItemStatus;

  /**
   * when publish set end date = current time + item time
   */
  @Column({ type: 'timestamptz', nullable: true })
  endDate?: Date;

  @ManyToOne(() => User, (user) => user.items, {
    cascade: true,
  })
  user: Promise<User>;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updateAt: Date;
}
