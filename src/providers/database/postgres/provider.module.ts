import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { PostgresConfigModule } from '../../../config/database/postgres/config.module';
import { PostgresConfigService } from '../../../config/database/postgres/config.service';
import { Keys } from '../../../models/keys/entities/keys.entity';
import { Transactions } from '../../../models/transactions/entities/transactions.entity';
import { Users } from '../../../models/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      inject: [PostgresConfigService],
      useFactory: async (postgresConfigService: PostgresConfigService) =>
        Object.assign(await getConnectionOptions(), {
          type: 'postgres',
          host: postgresConfigService.host,
          port: postgresConfigService.port,
          username: postgresConfigService.user,
          password: postgresConfigService.password,
          database: postgresConfigService.name,
          migrations: [],
          entities: [Users, Keys, Transactions],
        }),
    }),
  ],
})
export class PostgresModule {}
