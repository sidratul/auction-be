import { MoreThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { Item } from '../item/item.entity';
import { BalanceHistory } from '../balance/balanceHistory/balanceHistory.entity';

@Injectable()
export class BidRepository {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
  ) {}

  async save(bid: Bid): Promise<Bid> {
    return this.bidRepository.save(bid);
  }

  async getBidByUserIdAndCreatedDate(userId: string, date: Date): Promise<Bid> {
    return this.bidRepository.findOneBy({
      userId,
      createdAt: MoreThan(date),
    });
  }

  async getHighestBidItem(itemId: string, price: number): Promise<Bid> {
    return this.bidRepository.findOneBy({
      itemId,
      price: MoreThan(price),
    });
  }

  async getUserLastBidItem(userId: string, itemId: string): Promise<Bid> {
    return this.bidRepository.findOne({
      where: {
        itemId,
        userId,
      },
      order: {
        price: 'DESC',
      },
    });
  }

  async saveWithItemAndBalance(params: {
    bid: Bid;
    item: Item;
    balanceHistory: BalanceHistory;
  }): Promise<Bid> {
    const manager = this.bidRepository.manager;
    return manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(params.bid);
        await transactionalEntityManager.save(params.item);
        await transactionalEntityManager.save(params.balanceHistory);

        return params.bid;
      },
    );
  }
}
