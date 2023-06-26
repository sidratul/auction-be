import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/item.dto';
import { ItemStatus } from './item.enum';
import { ListItemDto } from './dto/list.dto';
import { Bid } from '../bid/bid.entity';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  constructor(private itemRepository: ItemRepository) {}

  async findAll(listDto: ListItemDto) {
    return this.itemRepository.findAll(listDto);
  }

  async getByIdAndUserId(id: string, userId: string): Promise<Item> {
    return this.itemRepository.getByIdAndUserId(id, userId).catch(() => {
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
    const item = await this.getByIdAndUserId(id, userId);
    item.status = ItemStatus.PUBLISHED;

    const date = new Date();
    date.setSeconds(date.getSeconds() + item.time);

    item.endDate = date;

    return this.itemRepository.save(item).catch((err) => {
      this.logger.error(`Failed publish item. Error: ${err.message}`);
      throw new InternalServerErrorException();
    });
  }

  async setHighestBid(bid: Bid): Promise<Item> {
    const item = await this.itemRepository.getById(bid.itemId);

    if (!item) {
      this.logger.warn(
        `Invalid item when set highest bid. item id: ${bid.itemId}`,
      );
      throw new BadRequestException('Invalid item');
    }

    item.highestBid = Promise.resolve(bid);

    return this.itemRepository.save(item).catch((err) => {
      this.logger.error(`Failed to create and set bid. Error: ${err.message}`);
      throw new InternalServerErrorException();
    });
  }
}
