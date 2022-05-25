import { registerAs } from '@nestjs/config';

export default registerAs('smtp', () => ({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASSWORD,
  scure: process.env.SMTP_SECURE,
  from: process.env.SMTP_FROM,
}));
