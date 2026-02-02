import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateDoctorInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
}
