import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import { BalanceService } from '../balance/balance.service';

describe('UserService', () => {
  let userService: UserService;
  let configService: ConfigService;

  const userRepository = {
    save() {
      return;
    },
    getByEmail() {
      return;
    },
  };

  const balanceService = {
    createBalanceObj() {
      return;
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        ConfigService,
        BalanceService,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: BalanceService,
          useValue: balanceService,
        },
        {
          provide: ConfigService,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            get: jest.fn((key: string) => {
              return null;
            }),
          },
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    configService = app.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create user', () => {
    const data: CreateUserDto = {
      name: 'Sidratul',
      password: '123456',
      confirmPassword: '123456',
      email: 'sidratulmm@email.com',
    };

    it('should create user successfully', async () => {
      const uuid = '0e6f5565-5eeb-4e13-8bed-e35309c72ff1';
      jest.spyOn(configService, 'get').mockImplementation(() => 10);
      jest
        .spyOn(userRepository, 'getByEmail')
        .mockImplementation(() => Promise.resolve(undefined));
      jest.spyOn(userRepository, 'save').mockImplementation(() =>
        Promise.resolve({
          ...data,
          id: uuid,
        }),
      );

      const response = await userService.createUser(data);
      expect(response.email).toBe(data.email);
      expect(response.id).toBe(uuid);
    });
  });
});
