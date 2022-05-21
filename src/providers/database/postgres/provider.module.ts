import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigModule } from '../../../config/database/postgres/config.module';
import { PostgresConfigService } from '../../../config/database/postgres/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      inject: [PostgresConfigService],
      useFactory: (postgresConfigService: PostgresConfigService) => ({
        type: 'postgres',
        host: postgresConfigService.host,
        port: postgresConfigService.port,
        username: postgresConfigService.user,
        password: postgresConfigService.password,
        database: postgresConfigService.name,
        entities: [],
      }),
    }),
  ],
})
export class PostgresModule {}
