import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmtpConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        SMTP_HOST: Joi.string(),
        SMTP_PORT: Joi.number(),
        SMTP_USER: Joi.string(),
        SMTP_PASSWORD: Joi.string(),
        SMTP_SECURE: Joi.string(),
        SMTP_FROM: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, SmtpConfigService],
  exports: [ConfigService, SmtpConfigService],
})
export class SmtpConfigModule {}
