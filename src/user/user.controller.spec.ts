import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthToken } from '../auth/types';

describe('UserController', () => {
  let userController: UserController;

  const userService = {
    findAll() {
      return;
    },
    createUser() {
      return;
    },
  };

  const authService = {
    getTokenFromUser(): Promise<AuthToken> {
      return;
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: AuthService,
          useValue: authService,
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
      const accessToken = '123';
      jest
        .spyOn(authService, 'getTokenFromUser')
        .mockImplementation(() =>
          Promise.resolve({ access_token: accessToken }),
        );
      const response = await userController.createUser(data);
      expect(response.access_token).toBe(accessToken);
    });
  });
});
