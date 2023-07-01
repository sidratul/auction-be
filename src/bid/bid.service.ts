import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { BidRepository } from './bid.repository';
import { CreateBidDto } from './bid.dto';
import { Bid } from './bid.entity';
import { BID_INTERVAL } from './bid.constant';
import { ItemService } from '../item/item.service';
import { BalanceService } from '../balance/balance.service';
import { Balance } from '../balance/balance.entity';
import { Item } from '../item/item.entity';
import { BalanceHistoryService } from '../balance/balanceHistory/balanceHistory.service';
import { BalanceHistoryStatus } from '../balance/balanceHistory/balanceHistory.enum';
import { ItemStatus } from '../item/item.enum';
import { BalanceHistory } from '../balance/balanceHistory/balanceHistory.entity';

@Injectable()
export class BidService {
  private readonly logger = new Logger(BidService.name);
  constructor(
    private bidRepository: BidRepository,
    @Inject(forwardRef(() => ItemService))
    private itemService: ItemService,
    private balanceService: BalanceService,
    private balanceHistoryService: BalanceHistoryService,
  ) {}

  async createBid(dto: CreateBidDto): Promise<Bid> {
    /** validate bid interval and validate bid price */
    const [balance, item, lastBid] = await Promise.all([
      this.validateUserBalance(dto.user.id, dto.price),
      this.getAndValidateItem(dto.itemId, dto.price),
      this.getUserLastBidItem(dto.user.id, dto.itemId),
      this.validateUserBid(dto.user.id),
    ]);

    const bid = new Bid();
    bid.itemId = dto.itemId;
    bid.price = dto.price;
    bid.userId = dto.user.id;

    if (item.status === ItemStatus.CREATED) {
      throw new BadRequestException('Item is not yet published');
    }

    if (item.endDate < new Date()) {
      throw new BadRequestException('Bid time has ended');
    }

    item.highestBid = Promise.resolve(bid);

    const lastBidPrice = lastBid ? lastBid.price : 0;
    const chargedPrice = bid.price - lastBidPrice;

    const balanceHistory = this.balanceHistoryService.getBalanceHistoryObj(
      balance,
      {
        amount: chargedPrice,
        status: BalanceHistoryStatus.BUY,
        description: `Bid Item for $${bid.price}. Charged for $${chargedPrice}`,
      },
    );

    /* save item, bid, balance and balance history  */
    return this.bidRepository.saveWithItemAndBalance({
      balanceHistory,
      bid,
      item,
    });
  }

  async getRefundData(
    bid: Bid,
  ): Promise<{ balance: Balance; balanceHistory: BalanceHistory }> {
    const balance = await this.balanceService.getByUserId(bid.userId);
    const balanceHistory = this.balanceHistoryService.getBalanceHistoryObj(
      balance,
      {
        amount: bid.price,
        status: BalanceHistoryStatus.REFUND,
        description: `Bid Item for $${bid.price}. Charged for $${bid.price}`,
      },
    );

    return {
      balance,
      balanceHistory,
    };
  }

  private async getUserLastBidItem(
    userId: string,
    itemId: string,
  ): Promise<Bid> {
    return this.bidRepository.getUserLastBidItem(userId, itemId);
  }

  /**
   * User can only bid with interval 5 second
   *
   * @param userId user id
   */
  private async validateUserBid(userId: string): Promise<void> {
    const date = new Date();
    date.setSeconds(date.getSeconds() - BID_INTERVAL);

    const bid = await this.bidRepository.getBidByUserIdAndCreatedDate(
      userId,
      date,
    );

    if (bid) {
      throw new BadRequestException(
        `You can only bid in each ${BID_INTERVAL} second`,
      );
    }
  }

  /**
   * Check bid price. price should be higher than previous bid price
   *
   * @param itemId item id
   * @param price bid price
   */
  private async getAndValidateItem(
    itemId: string,
    price: number,
  ): Promise<Item> {
    const item = await this.itemService.getByIdWithHighstBid(itemId);

    const highestBid = await item.highestBid;
    const lastBid = highestBid ? highestBid.price : item.startPrice;
    if (price <= lastBid) {
      throw new BadRequestException(`Bid should higher than previous bid`);
    }

    return item;
  }

  private async validateUserBalance(
    userId: string,
    price: number,
  ): Promise<Balance> {
    const balance = await this.balanceService.getByUserId(userId);

    if (balance.amount < price) {
      throw new BadRequestException(`Insufficient Balance`);
    }

    return balance;
  }

  async getGroupByUserByHIghts(itemId: string): Promise<Bid[]> {
    return this.bidRepository.getGroupByUserByHIghts(itemId);
  }
}
