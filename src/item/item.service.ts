import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/item.dto';
import { ItemStatus } from './item.enum';
import { ListItemDto } from './dto/list.dto';
import { ListData } from 'src/types';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BidService } from '../bid/bid.service';
import { BalanceHistory } from 'src/balance/balanceHistory/balanceHistory.entity';
import { Balance } from 'src/balance/balance.entity';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  constructor(
    private itemRepository: ItemRepository,
    @Inject(forwardRef(() => BidService))
    private bidService: BidService,
  ) {}

  async findAll(listDto: ListItemDto): Promise<ListData<Item>> {
    const [items, total] = await this.itemRepository
      .findAll(listDto)
      .catch((err) => {
        this.logger.warn(
          `error get item list with data ${JSON.stringify(listDto)}. Error: ${
            err.message
          }`,
        );
        throw new InternalServerErrorException();
      });

    return {
      total,
      data: items,
    };
  }

  async getPublishReadyItem(id: string, userId: string): Promise<Item> {
    return this.itemRepository.getPublishReadyItem(id, userId).catch(() => {
      this.logger.warn(`Item not found with id: ${id} and user id : ${userId}`);
      throw new BadRequestException(`Invalid item`);
    });
  }

  async createItem(dto: CreateItemDto): Promise<Item> {
    const item = new Item();
    item.userId = dto.user.id;
    item.name = dto.name;
    item.startPrice = dto.startPrice;
    item.time = dto.time;

    return this.itemRepository.save(item).catch((err) => {
      this.logger.error(`Failed create item. Error: ${err.message}`);
      throw new InternalServerErrorException();
    });
  }

  async publishItem(id: string, userId: string): Promise<Item> {
    const item = await this.getPublishReadyItem(id, userId);
    item.status = ItemStatus.PUBLISHED;

    const date = new Date();
    date.setSeconds(date.getSeconds() + item.time);

    item.endDate = date;

    return this.itemRepository.save(item).catch((err) => {
      this.logger.error(`Failed publish item. Error: ${err.message}`);
      throw new InternalServerErrorException();
    });
  }

  async getByIdWithHighstBid(id: string): Promise<Item> {
    const item = await this.itemRepository.getByIdWithHighstBid(id);

    if (!item) {
      this.logger.warn(`Invalid item id: ${id}`);
      throw new BadRequestException('Invalid item');
    }

    return item;
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async completeItem(): Promise<void> {
    // this.logger.debug('Called every 30 seconds');
    /* get item with end date < current date and status not completed*/
    const items = await this.itemRepository.findReadyToComplete();
    for (const item of items) {
      /* get hight bid */
      item.status = ItemStatus.COMPLETED;

      /* get other bid and refund */
      const bids = await this.bidService.getGroupByUserByHIghts(item.id);
      const [highestbid, ...refundBids] = bids;

      if (highestbid) {
        item.highestBid = Promise.resolve(highestbid);
      }

      const { balanceHistories, balances } = await refundBids.reduce(
        async (results, bid) => {
          const res = await results;
          const balanceData = await this.bidService.getRefundData(bid);
          res.balances.push(balanceData.balance);
          res.balanceHistories.push(balanceData.balanceHistory);
          return results;
        },
        Promise.resolve({
          balances: [] as Balance[],
          balanceHistories: [] as BalanceHistory[],
        }),
      );

      /* update balance, add balance history, update item highest bid and status */
      await this.itemRepository
        .saveComplteItem(item, balances, balanceHistories)
        .catch((err) => {
          this.logger.error(
            `Error to completed bid process. Error: ${err.message}`,
          );
          //dont throw error. continue to other item
        });
    }
  }
}
