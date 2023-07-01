import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.dto';
import { ConfigService } from '@nestjs/config';
import { BalanceService } from '../balance/balance.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private usersRepository: UserRepository,
    private configService: ConfigService,
    @Inject(forwardRef(() => BalanceService))
    private readonly balanceService: BalanceService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    /** check if user exists */
    const existsUser = await this.usersRepository.getByEmail(dto.email);
    if (existsUser) {
      throw new BadRequestException('User exists');
    }

    const user = new User();
    user.email = dto.email;
    user.name = dto.name;
    /** encrypt password */
    user.password = await bcrypt.hash(
      dto.password,
      this.configService.get('SALT') || 10,
    );

    const balance = this.balanceService.createBalanceObj(user);

    return this.usersRepository
      .saveWithNewBalance(user, balance)
      .catch((err) => {
        this.logger.error(`Failed to create user. ERROR: ${err.message}`);
        throw new InternalServerErrorException();
      });
  }

  async getById(id: string): Promise<User> {
    return this.usersRepository.getById(id);
  }

  async getByEmailWithPassword(email: string): Promise<User> {
    return this.usersRepository.getByEmailWithPassword(email);
  }

  async isPasswordMatch(user: User, password): Promise<boolean> {
    try {
      return await bcrypt.compare(password, user.password);
    } catch (err) {
      this.logger.error(`Compare password failed. Error: ${err.message}`);
      throw new InternalServerErrorException();
    }
  }
}
