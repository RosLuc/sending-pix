import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KeysRepository } from '../keys/keys.repository';
import { UsersRepository } from '../users/users.repository';
import { ITransactionRequest } from './interfaces/transaction-request.interface';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionsRepository)
    private transactionsRepository: TransactionsRepository,
    @InjectRepository(KeysRepository)
    private keysRepository: KeysRepository,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async register(userId: string, { key, value }: ITransactionRequest) {
    const userExist = await this.usersRepository.findOne(userId, {
      relations: ['keys'],
    });

    if (!userExist) throw new NotFoundException('User not found');

    const keyExist = await this.keysRepository.findOne({
      where: { value: key },
      relations: ['user'],
    });

    if (!keyExist) throw new NotFoundException('key not found');

    if (userExist.id === keyExist.user.id)
      throw new BadRequestException(
        'It is not possible to carry out transactions for the same user',
      );

    try {
      const newTransaction = this.transactionsRepository.create({
        value,
        senderUser: { ...userExist, keys: undefined },
        receiverUser: keyExist.user,
      });

      await this.transactionsRepository.save(newTransaction);

      return newTransaction;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async listTransactionsSent(userId: string) {
    const userExist = await this.usersRepository.findOne(userId, {
      relations: ['sentTransactions', 'sentTransactions.receiverUser'],
    });

    if (!userExist) throw new NotFoundException('User not found');

    return userExist.sentTransactions;
  }
}
