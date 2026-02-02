import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { Patient } from './patient.model';
import { PatientsService } from './patients.service';

@Resolver(() => Patient)
@UseGuards(JwtAuthGuard)
export class PatientsResolver {
  constructor(private readonly patientsService: PatientsService) {}

  @Mutation(() => Patient)
  createPatient(@Args('data') data: CreatePatientInput) {
    return this.patientsService.create(data);
  }

  @Query(() => [Patient], { name: 'patients' })
  findAll(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('skip', { type: () => Number, nullable: true }) skip?: number,
    @Args('take', { type: () => Number, nullable: true }) take?: number,
  ) {
    return this.patientsService.findAll(search, skip, take);
  }

  @Query(() => Patient, { name: 'patient' })
  findOne(@Args('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Mutation(() => Patient)
  updatePatient(@Args('data') data: UpdatePatientInput) {
    return this.patientsService.update(data.id, data);
  }

  @Mutation(() => Patient)
  removePatient(@Args('id') id: string) {
    return this.patientsService.remove(id);
  }
}
