import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST') || 'localhost',
          port: config.get('MAIL_PORT') || 1025,
          secure: false,
          auth: config.get('MAIL_USER') ? {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          } : undefined,
        },
        defaults: {
          from: `"Healthcare Scheduling" <${config.get('MAIL_FROM') || 'noreply@healthcare.com'}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
