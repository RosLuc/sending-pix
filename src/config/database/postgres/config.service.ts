import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from '../../app/config.service';

@Injectable()
export class PostgresConfigService {
  constructor(
    private configService: ConfigService,
    private appConfigService: AppConfigService,
  ) {}

  get host(): string {
    return this.configService.get<string>('database.host');
  }
  get user(): string {
    return this.configService.get<string>('database.user');
  }
  get password(): string {
    return this.configService.get<string>('database.password');
  }
  get port(): number {
    return Number(this.configService.get<number>('database.port'));
  }
  get name(): string {
    const databaseName = this.configService.get<string>('database.name');
    return this.appConfigService.env === 'test'
      ? databaseName + '_test'
      : databaseName;
  }
}
