import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeysRepository } from '../keys/keys.repository';
import { UsersRepository } from '../users/users.repository';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { EmailModule } from '../../providers/email/provider.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionsRepository,
      UsersRepository,
      KeysRepository,
    ]),
    EmailModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
