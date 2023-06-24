import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../user/user.dto';

export class LoginDto extends PickType(CreateUserDto, ['email', 'password']) {}
