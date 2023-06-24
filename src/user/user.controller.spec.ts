import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

describe('UserController', () => {
  let userController: UserController;

  const userService = {
    findAll() {
      return;
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  const data: CreateUserDto = {
    name: 'Sidratul',
    password: '123456',
    confirmPassword: '123456',
    email: 'sidratulmm@email.com',
  };

  describe('root', () => {
    it('should create user', async () => {
      const response = await userController.createUser(data);
      expect(response).toBe(true);
    });
  });
});
