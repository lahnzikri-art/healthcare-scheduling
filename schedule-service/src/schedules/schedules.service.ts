import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { FilterScheduleInput } from './dto/filter-schedule.input';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SchedulesService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

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
    const schedule = await this.prisma.schedule.create({
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

    // 5. Send email notification (async, don't block)
    this.mailService.sendScheduleCreated(
      customer.email,
      customer.name,
      {
        objective: schedule.objective,
        doctorName: doctor.name,
        scheduledAt: schedule.scheduledAt,
      },
    ).catch(err => this.prisma['$log']?.error('Email sending failed:', err));

    return schedule;
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
    const schedule = await this.findOne(id);

    // Send email notification before deletion
    this.mailService.sendScheduleDeleted(
      schedule.customer.email,
      schedule.customer.name,
      {
        objective: schedule.objective,
        doctorName: schedule.doctor.name,
        scheduledAt: schedule.scheduledAt,
      },
    ).catch(err => this.prisma['$log']?.error('Email sending failed:', err));

    await this.prisma.schedule.delete({
      where: { id },
    });

    return true;
  }
}
