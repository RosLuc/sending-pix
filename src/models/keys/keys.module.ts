import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { KeysRepository } from './keys.repository';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KeysRepository, UsersRepository])],
  providers: [KeysService],
  controllers: [KeysController],
})
export class KeysModule {}
