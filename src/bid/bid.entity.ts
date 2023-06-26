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
import { Item } from 'src/item/item.entity';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ type: 'numeric' })
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
