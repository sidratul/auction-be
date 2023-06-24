import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { UserRepository } from './user.repository';

describe('UserService', () => {
  let userService: UserService;

  const userRepository = {
    save() {
      return;
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
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
