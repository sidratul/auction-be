import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';
import { ItemRepository } from './item.repository';
import { CreateItemDto } from './dto/item.dto';
import { User } from '../user/user.entity';
import { Item } from './item.entity';
import { ItemStatus } from './item.enum';

describe('ItemService', () => {
  let itemService: ItemService;

  const user = {
    id: '3d2743e8-a809-48af-aa77-2555a5ff33b2',
    name: 'sid',
    email: 'sidratul@gmail.com',
  } as User;

  const item: Item = {
    id: '3d2743e8-a809-48af-aa77-2555a5ff33b3',
    name: 'Item 1',
    startPrice: 100,
    status: ItemStatus.CREATED,
    time: 60 * 60,
    user: Promise.resolve(user),
    userId: user.id,
  };

  const itemRepository = {
    save(item: Item) {
      return Promise.resolve(item);
    },
    getByIdAndUserId() {
      return;
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        ItemRepository,
        {
          provide: ItemRepository,
          useValue: itemRepository,
        },
      ],
    }).compile();

    itemService = app.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(itemService).toBeDefined();
  });

  describe('create item', () => {
    const data: CreateItemDto = {
      name: 'Item 1',
      startPrice: 100,
      time: 60 * 60,
      user: user,
    };

    it('should create item successfully', async () => {
      const response = await itemService.createItem(data);
      expect(response.userId).toBe(user.id);
      expect(response.name).toBe(data.name);
    });
  });

  describe('publish item', () => {
    it('should publish item successfully', async () => {
      jest.useFakeTimers();
      const date = new Date('2023-12-20 10:00:00');

      jest.setSystemTime(date);
      jest
        .spyOn(itemRepository, 'getByIdAndUserId')
        .mockImplementation(() => Promise.resolve(item));

      const response = await itemService.publishItem(item.id, user.id);
      expect(response.status).toBe(ItemStatus.PUBLISHED);
      expect(response.endDate.getTime()).toBe(
        date.getTime() + item.time * 1000,
      );
    });
  });
});
