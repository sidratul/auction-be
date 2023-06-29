import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ListItemDto } from './dto/list.dto';

@Injectable()
export class ItemRepository {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async findAll(dto: ListItemDto): Promise<[Item[], number]> {
    const query = this.itemRepository.createQueryBuilder('item').where('true');

    // if (dto.userId) {
    //   query.andWhere('item.userId = :userId', { userId: dto.userId });
    // }

    query.offset((dto.page - 1) * dto.limit);
    query.limit(dto.limit);

    return query.getManyAndCount();
  }

  async getByIdWithHighstBid(id: string): Promise<Item> {
    return this.itemRepository.findOneOrFail({
      relations: ['highestBid'],
      where: {
        id: id,
      }
    });
  }

  async getByIdAndUserId(id: string, userId: string): Promise<Item> {
    return this.itemRepository.findOneByOrFail({ id, userId });
  }

  async save(item: Item): Promise<Item> {
    return this.itemRepository.save(item);
  }
}
