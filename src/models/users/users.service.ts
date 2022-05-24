import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from './interfaces/users.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async create(newUser: IUser) {
    const emailAlreadyInUse = !!(await this.usersRepository.findOne({
      where: {
        email: newUser.email,
      },
    }));

    if (emailAlreadyInUse)
      throw new BadRequestException('Email already in use');

    try {
      const user = this.usersRepository.create(newUser);
      await this.usersRepository.save(user);

      return user;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async list() {
    const users = await this.usersRepository.find();

    return users;
  }
}
