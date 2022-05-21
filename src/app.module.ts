import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { PostgresConfigModule } from './config/database/postgres/config.module';
import { PostgresModule } from './providers/database/postgres/provider.module';

@Module({
  imports: [AppConfigModule, PostgresConfigModule, PostgresModule],
})
export class AppModule {}
