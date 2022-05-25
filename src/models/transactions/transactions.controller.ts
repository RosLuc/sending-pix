import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterTransactionDto } from './dto/register-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post(':userId')
  async create(
    @Param('userId') userId: string,
    @Body() registerTransactionDto: RegisterTransactionDto,
  ) {
    return await this.transactionsService.register(
      userId,
      registerTransactionDto,
    );
  }

  @Get('listSent/:userId')
  async list(@Param('userId') userId: string) {
    return await this.transactionsService.listTransactionsSent(userId);
  }
}
