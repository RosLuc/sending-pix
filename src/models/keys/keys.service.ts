import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { IKey } from './interfaces/keys.interface';
import { KeysRepository } from './keys.repository';

@Injectable()
export class KeysService {
  constructor(
    @InjectRepository(KeysRepository)
    private keysRepository: KeysRepository,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async register(userId: string, newKey: IKey) {
    const userExist = await this.usersRepository.findOne(userId, {
      relations: ['keys'],
    });

    if (!userExist) throw new NotFoundException('User not found');

    if (userExist.keys.length >= 3)
      throw new BadRequestException('Limit of three keys reached');

    const keyAlreadyExist = await this.keysRepository.findOne({
      where: {
        value: newKey.value,
      },
    });
    if (!!keyAlreadyExist) throw new BadRequestException('key already exists');

    try {
      const key = this.keysRepository.create({ ...newKey, user: userExist });

      await this.keysRepository.save(key);

      key.user = undefined;
      return key;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async list(userId: string) {
    const userExist = await this.usersRepository.findOne(userId, {
      relations: ['keys'],
    });

    if (!userExist) throw new NotFoundException('User not found');

    return userExist.keys;
  }
}
