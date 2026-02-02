import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesResolver } from './schedules.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [SchedulesService, SchedulesResolver],
})
export class SchedulesModule {}
