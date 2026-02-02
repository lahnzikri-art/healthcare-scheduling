import { Module } from '@nestjs/common';
import { PatientsResolver } from './patients.resolver';
import { PatientsService } from './patients.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [PatientsResolver, PatientsService],
  imports: [PrismaModule],
})
export class PatientsModule {}
