import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let userService: UserService;
  let configService: ConfigService;

  const userRepository = {
    save() {
      return;
    },
    findByEmail() {
      return;
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        ConfigService,
        {
          provide: UserRepository,
          useValue: userRepository,
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
        .spyOn(userRepository, 'findByEmail')
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