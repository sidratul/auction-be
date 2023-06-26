import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BidService } from './bid.service';
import { BidRepository } from './bid.repository';
import { Bid } from './bid.entity';
import { ItemModule } from 'src/item/item.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid]),
    ItemModule,
    AuthModule,
    UserModule,
  ],
  providers: [BidService, BidRepository],
  controllers: [],
  exports: [BidService],
})
export class BidModule {}
