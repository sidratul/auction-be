import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BidService } from './bid.service';
import { BidRepository } from './bid.repository';
import { Bid } from './bid.entity';
import { ItemModule } from 'src/item/item.module';
import { UserModule } from 'src/user/user.module';
import { BidController } from './bid.controller';
import { BalanceModule } from 'src/balance/balance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid]),
    forwardRef(() => ItemModule),
    AuthModule,
    forwardRef(() => UserModule),
    forwardRef(() => BalanceModule),
  ],
  providers: [BidService, BidRepository],
  controllers: [BidController],
  exports: [BidService],
})
export class BidModule {}
