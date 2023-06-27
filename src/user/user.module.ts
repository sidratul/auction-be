import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { AuthModule } from '../auth/auth.module';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => BalanceModule),
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
