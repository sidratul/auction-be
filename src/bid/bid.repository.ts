import { MoreThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from './bid.entity';

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

  async getHighestBidItem(itemId: string, price): Promise<Bid> {
    return this.bidRepository.findOneBy({
      itemId,
      price: MoreThan(price),
    });
  }
}
