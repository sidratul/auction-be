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
import { ListData } from 'src/types';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  constructor(private itemRepository: ItemRepository) {}

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

  async getByIdWithHighstBid(id: string): Promise<Item> {
    const item = await this.itemRepository.getByIdWithHighstBid(id);

    if (!item) {
      this.logger.warn(`Invalid item id: ${id}`);
      throw new BadRequestException('Invalid item');
    }

    return item;
  }
}
