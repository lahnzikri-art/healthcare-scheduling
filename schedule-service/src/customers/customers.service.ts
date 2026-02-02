import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCustomerInput) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (existingCustomer) {
      throw new ConflictException('Email already exists');
    }

    return this.prisma.customer.create({
      data,
    });
  }

  async findAll(skip?: number, take?: number) {
    return this.prisma.customer.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: string, data: UpdateCustomerInput) {
    await this.findOne(id);

    if (data.email) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { email: data.email },
      });

      if (existingCustomer && existingCustomer.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.customer.delete({
      where: { id },
    });

    return true;
  }
}
