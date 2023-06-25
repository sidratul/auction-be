import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/item.dto';
import { ItemStatus } from './item.enum';
import { ListItemDto } from './dto/list.dto';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  constructor(private itemRepository: ItemRepository) {}

  async findAll(listDto: ListItemDto) {
    return this.itemRepository.findAll(listDto);
  }

  async getByIdAndUserId(id: string, userId: string): Promise<Item> {
    return this.itemRepository.getByIdAndUserId(id, userId).catch(() => {
      this.logger.warn(`Item not found with id: ${id}`);
      throw new NotFoundException(`Item not found`);
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
}
