import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule } from './schedule.model';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { FilterScheduleInput } from './dto/filter-schedule.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Schedule)
@UseGuards(JwtAuthGuard)
export class SchedulesResolver {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Mutation(() => Schedule)
  createSchedule(@Args('input') input: CreateScheduleInput) {
    return this.schedulesService.create(input);
  }

  @Mutation(() => Boolean)
  deleteSchedule(@Args('id') id: string) {
    return this.schedulesService.remove(id);
  }

  @Query(() => [Schedule])
  schedules(
    @Args('filter', { nullable: true }) filter?: FilterScheduleInput,
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
  ) {
    return this.schedulesService.findAll(filter, skip, take);
  }

  @Query(() => Schedule)
  schedule(@Args('id') id: string) {
    return this.schedulesService.findOne(id);
  }
}
