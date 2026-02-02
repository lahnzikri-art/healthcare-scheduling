import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesResolver } from './schedules.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, AuthModule, MailModule],
  providers: [SchedulesService, SchedulesResolver],
})
export class SchedulesModule {}
