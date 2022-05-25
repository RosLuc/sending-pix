import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SmtpConfigModule } from '../../config/smtp/config.module';
import { SmtpConfigService } from '../../config/smtp/config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [SmtpConfigModule],
      inject: [SmtpConfigService],
      useFactory: async (smtpConfigService: SmtpConfigService) => ({
        transport: {
          host: smtpConfigService.host,
          port: smtpConfigService.port,
          secure: smtpConfigService.port === 465 ? true : false,
          auth: {
            user: smtpConfigService.user,
            pass: smtpConfigService.pass,
          },
        },
        defaults: {
          from: `"SendingPix" <${smtpConfigService.from}>`,
        },
      }),
    }),
  ],
})
export class EmailModule {}
