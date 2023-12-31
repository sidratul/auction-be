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
import { User } from '../user/user.entity';
import { Item } from '../item/item.entity';
import { numberTransformer } from '../utils';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({
    type: 'numeric',
    transformer: numberTransformer,
  })
  price: number;

  @Column()
  @RelationId((bid: Bid) => bid.item)
  @Index()
  itemId: string;

  @ManyToOne(() => Item, (item) => item.bids, {
    cascade: true,
  })
  item: Promise<Item>;

  @Column()
  @RelationId((bid: Bid) => bid.user)
  @Index()
  userId: string;

  /** TODO: create status */

  @ManyToOne(() => User, (user) => user.items, {
    cascade: true,
  })
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
