import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Item } from './item.entity';
import { ItemService } from './item.service';
import { ItemRepository } from './item.repository';
import { ItemsController } from './item.controller';
import { UserModule } from '../user/user.module';
import { BidModule } from '../bid/bid.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    AuthModule,
    forwardRef(() => UserModule),
    forwardRef(() => BidModule),
  ],
  providers: [ItemService, ItemRepository],
  controllers: [ItemsController],
  exports: [ItemService],
})
export class ItemModule {}
