import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { ItemStatus } from './item.enum';
import { User } from '../user/user.entity';
import { Bid } from '../bid/bid.entity';
import { numberTransformer } from '../utils';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  /**
   * save time in second
   */
  @Column({
    type: 'numeric',
    transformer: numberTransformer,
  })
  time: number;

  @Column({
    type: 'numeric',
    transformer: numberTransformer,
  })
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

  @Column()
  @RelationId((item: Item) => item.user)
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.items, {
    cascade: true,
  })
  user: Promise<User>;

  @OneToMany(() => Bid, (bid) => bid.item)
  bids: Promise<Bid[]>;

  @OneToOne(() => Bid, { nullable: true, cascade: true })
  @JoinColumn({ name: 'highestBidId' })
  highestBid: Promise<Bid>;

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
