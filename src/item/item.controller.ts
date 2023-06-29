import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserContext } from '../auth/auth.decorator';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/item.dto';
import { Item } from './item.entity';
import { ListItemDto } from './dto/list.dto';
import { User } from '../user/user.entity';
import { ListData } from 'src/types';

@Controller('items')
@UseGuards(AuthGuard)
export class ItemsController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async findAll(@Query() listItemDto: ListItemDto): Promise<ListData<Item>> {
    return this.itemService.findAll(listItemDto);
  }

  @Post()
  async createItem(
    @Body() createItemDto: CreateItemDto,
    @UserContext() user: User,
  ): Promise<Item> {
    createItemDto.user = user;
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
