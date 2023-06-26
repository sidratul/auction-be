import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Item } from './item.entity';
import { ItemService } from './item.service';
import { ItemRepository } from './item.repository';
import { ItemsController } from './item.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), AuthModule, UserModule],
  providers: [ItemService, ItemRepository],
  controllers: [ItemsController],
  exports: [ItemService],
})
export class ItemModule {}
