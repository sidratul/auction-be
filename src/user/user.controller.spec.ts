import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthToken } from '../auth/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
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
