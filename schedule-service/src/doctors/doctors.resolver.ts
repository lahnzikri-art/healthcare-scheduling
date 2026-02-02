import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { Doctor } from './doctor.model';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Doctor)
@UseGuards(JwtAuthGuard)
export class DoctorsResolver {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Mutation(() => Doctor)
  createDoctor(@Args('input') input: CreateDoctorInput) {
    return this.doctorsService.create(input);
  }

  @Mutation(() => Doctor)
  updateDoctor(
    @Args('id') id: string,
    @Args('input') input: UpdateDoctorInput,
  ) {
    return this.doctorsService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteDoctor(@Args('id') id: string) {
    return this.doctorsService.remove(id);
  }

  @Query(() => [Doctor])
  doctors(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
  ) {
    return this.doctorsService.findAll(skip, take);
  }

  @Query(() => Doctor)
  doctor(@Args('id') id: string) {
    return this.doctorsService.findOne(id);
  }
}
