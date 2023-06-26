import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BidRepository } from './bid.repository';
import { CreateBidDto } from './bid.dto';
import { Bid } from './bid.entity';
import { BID_INTERVAL } from './bid.constant';
import { ItemService } from '../item/item.service';

@Injectable()
export class BidService {
  private readonly logger = new Logger(BidService.name);
  constructor(
    private bidRepository: BidRepository,
    private itemService: ItemService,
  ) {}

  async createBid(dto: CreateBidDto): Promise<Bid> {
    /** validate bid interval and validate bid price */
    await Promise.all([
      this.validateUserBid(dto.user.id),
      this.validateBidPrice(dto.itemId, dto.price),
    ]);

    const bid = new Bid();
    bid.itemId = dto.itemId;
    bid.price = dto.price;
    bid.userId = dto.user.id;

    /** update item and set new bid to highest bid */
    const item = await this.itemService.setHighestBid(bid);
    return item.highestBid;
  }

  /**
   * User can only bid with interval 5 second
   *
   * @param userId user id
   */
  private async validateUserBid(userId: string): Promise<void> {
    const date = new Date();
    date.setSeconds(date.getSeconds() + BID_INTERVAL);

    const bid = await this.bidRepository.getBidByUserIdAndCreatedDate(
      userId,
      date,
    );

    if (bid) {
      throw new BadRequestException(`You can only bid in each 5second`);
    }
  }

  /**
   * Check bid price. price should be higher than previous bid price
   *
   * @param itemId item id
   * @param price bid price
   */
  private async validateBidPrice(itemId: string, price: number): Promise<void> {
    const bid = await this.bidRepository.getHighestBidItem(itemId, price);

    if (bid) {
      throw new BadRequestException(`Invalid bid price`);
    }
  }
}
