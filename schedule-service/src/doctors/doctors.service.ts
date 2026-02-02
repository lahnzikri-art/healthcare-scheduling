import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDoctorInput) {
    return this.prisma.doctor.create({
      data,
    });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.doctor.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async update(id: string, data: UpdateDoctorInput) {
    await this.findOne(id);

    return this.prisma.doctor.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.doctor.delete({
      where: { id },
    });

    return true;
  }
}
