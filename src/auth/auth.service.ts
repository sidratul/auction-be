import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse, TokenPayload } from './types';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.getByEmailWithPassword(dto.email);
    if (!user) {
      throw new BadRequestException('User not exist');
    }

    const isMatch = await this.userService.isPasswordMatch(user, dto.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return this.getTokenFromUser(user);
  }

  async getTokenFromUser(user: User): Promise<LoginResponse> {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
    };

    delete user.password;

    const token = await this.jwtService.signAsync(payload).catch((err) => {
      this.logger.error(`Failed to create jwt token. Error: ${err.message}`);
      throw new InternalServerErrorException();
    });

    /** TODO: Create refresh token */
    return {
      user,
      access_token: token,
    };
  }
}
