import { Brackets, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ListItemDto } from './dto/list.dto';
import { ItemStatus } from './item.enum';

@Injectable()
export class ItemRepository {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async findAll(dto: ListItemDto): Promise<[Item[], number]> {
    const query = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.highestBid', 'highestBid')
      .where('true');

    // if (dto.userId) {
    //   query.andWhere('item.userId = :userId', { userId: dto.userId });
    // }

    if (dto.status) {
      query.where(
        new Brackets((qb) => {
          if (dto.status.includes(ItemStatus.CREATED)) {
            qb.orWhere('item.status = :status', { status: ItemStatus.CREATED });
          }

          if (dto.status.includes(ItemStatus.COMPLETED)) {
            qb.orWhere('item.endDate < now()');
          }

          if (dto.status.includes(ItemStatus.PUBLISHED)) {
            qb.orWhere('item.endDate > now() AND item.status = :status', {
              status: ItemStatus.PUBLISHED,
            });
          }
        }),
      );
      // query.where('item.status IN (:...status)', { status: dto.status });
    }

    query.orderBy(`item.${dto.orderBy}`, dto.orderType);
    query.offset((dto.page - 1) * dto.limit);
    query.limit(dto.limit);

    return query.getManyAndCount();
  }

  async getByIdWithHighstBid(id: string): Promise<Item> {
    return this.itemRepository.findOneOrFail({
      relations: ['highestBid'],
      where: {
        id: id,
      },
    });
  }

  async getPublishReadyItem(id: string, userId: string): Promise<Item> {
    return this.itemRepository.findOneByOrFail({
      id,
      userId,
      status: ItemStatus.CREATED,
    });
  }

  async save(item: Item): Promise<Item> {
    return this.itemRepository.save(item);
  }
}
