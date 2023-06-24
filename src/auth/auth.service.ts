import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from './types';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthToken> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('User not exist');
    }

    const isMatch = await this.userService.isPasswordMatch(user, dto.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return this.getTokenFromUser(user);
  }

  async getTokenFromUser(user: User): Promise<AuthToken> {
    const payload = { id: user.id, name: user.name, email: user.email };
    /** Create refresh token */
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
