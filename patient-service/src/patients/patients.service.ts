import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { Patient } from './patient.model';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePatientInput): Promise<Patient> {
    return this.prisma.patient.create({
      data,
    });
  }

  async findAll(search?: string, skip?: number, take?: number): Promise<Patient[]> {
    return this.prisma.patient.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { nik: { contains: search } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdatePatientInput): Promise<Patient> {
    // Remove id field from update data
    const { id: _, ...updateData } = data;

    return this.prisma.patient.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Patient> {
    return this.prisma.patient.delete({
      where: { id },
    });
  }
}
