import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserContext } from '../auth/auth.decorator';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/item.dto';
import { Item } from './item.entity';
import { ListItemDto } from './dto/list.dto';
import { User } from 'src/user/user.entity';

@Controller('items')
@UseGuards(AuthGuard)
export class ItemsController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async findAll(@Body() listItemDto: ListItemDto): Promise<Item[]> {
    return this.itemService.findAll(listItemDto);
  }

  @Post()
  async createItem(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemService.createItem(createItemDto);
  }

  @Patch('/:id/publish')
  async publishItem(
    @UserContext() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Item> {
    return this.itemService.publishItem(id, user.id);
  }
}
