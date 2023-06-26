import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { BidService } from './bid.service';
import { CreateBidDto } from './bid.dto';
import { Bid } from './bid.entity';
import { ApiBody } from '@nestjs/swagger';
import { UserContext } from 'src/auth/auth.decorator';
import { User } from 'src/user/user.entity';

@Controller('bids')
@UseGuards(AuthGuard)
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  @ApiBody({ type: CreateBidDto })
  async createBid(
    @Body() dto: CreateBidDto,
    @UserContext() user: User,
  ): Promise<Bid> {
    dto.user = user;
    return this.bidService.createBid(dto);
  }
}
