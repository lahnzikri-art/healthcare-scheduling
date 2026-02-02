import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { FilterScheduleInput } from './dto/filter-schedule.input';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateScheduleInput) {
    // 1. Validate Customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // 2. Validate Doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: data.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // 3. Check double-booking (same doctor + same time)
    const scheduledAt = new Date(data.scheduledAt);
    const conflictingSchedule = await this.prisma.schedule.findFirst({
      where: {
        doctorId: data.doctorId,
        scheduledAt,
      },
    });

    if (conflictingSchedule) {
      throw new ConflictException(
        'Doctor already has a schedule at this time',
      );
    }

    // 4. Create schedule
    return this.prisma.schedule.create({
      data: {
        objective: data.objective,
        customerId: data.customerId,
        doctorId: data.doctorId,
        scheduledAt,
      },
      include: {
        customer: true,
        doctor: true,
      },
    });
  }

  async findAll(filter?: FilterScheduleInput, skip?: number, take?: number) {
    const where: any = {};

    if (filter?.customerId) {
      where.customerId = filter.customerId;
    }

    if (filter?.doctorId) {
      where.doctorId = filter.doctorId;
    }

    return this.prisma.schedule.findMany({
      where,
      skip,
      take,
      orderBy: { scheduledAt: 'asc' },
      include: {
        customer: true,
        doctor: true,
      },
    });
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        customer: true,
        doctor: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.schedule.delete({
      where: { id },
    });

    return true;
  }
}
