import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './customer.model';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Customer)
@UseGuards(JwtAuthGuard)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Mutation(() => Customer)
  createCustomer(@Args('input') input: CreateCustomerInput) {
    return this.customersService.create(input);
  }

  @Mutation(() => Customer)
  updateCustomer(
    @Args('id') id: string,
    @Args('input') input: UpdateCustomerInput,
  ) {
    return this.customersService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteCustomer(@Args('id') id: string) {
    return this.customersService.remove(id);
  }

  @Query(() => [Customer])
  customers(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
  ) {
    return this.customersService.findAll(skip, take);
  }

  @Query(() => Customer)
  customer(@Args('id') id: string) {
    return this.customersService.findOne(id);
  }
}
