import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { UserContext } from 'src/auth/auth.decorator';
import { User } from 'src/user/user.entity';
import { BalanceDto } from './balance.dto';
import { Balance } from './balance.entity';
import { BalanceService } from './balance.service';

@Controller('balances')
@UseGuards(AuthGuard)
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  @ApiBody({ type: BalanceDto })
  async deposit(
    @Body() dto: BalanceDto,
    @UserContext() user: User,
  ): Promise<Balance> {
    dto.user = user;
    return this.balanceService.deposit(dto);
  }

  @Get()
  async myBalance(@UserContext() user: User): Promise<Balance> {
    return this.balanceService.getByUserId(user.id);
  }
}
