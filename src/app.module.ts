import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { PostgresConfigModule } from './config/database/postgres/config.module';
import { PostgresModule } from './providers/database/postgres/provider.module';
import { UsersModule } from './models/users/users.module';
import { KeysModule } from './models/keys/keys.module';

@Module({
  imports: [
    AppConfigModule,
    PostgresConfigModule,
    PostgresModule,
    UsersModule,
    KeysModule,
  ],
})
export class AppModule {}
