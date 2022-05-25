import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmtpConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('smtp.host');
  }
  get pass(): string {
    return this.configService.get<string>('smtp.pass');
  }
  get user(): string {
    return this.configService.get<string>('smtp.user');
  }
  get port(): number {
    return Number(this.configService.get<number>('smtp.port'));
  }
  get secure(): string {
    return this.configService.get<string>('smtp.secure');
  }

  get from(): string {
    return this.configService.get<string>('smtp.from');
  }
}
