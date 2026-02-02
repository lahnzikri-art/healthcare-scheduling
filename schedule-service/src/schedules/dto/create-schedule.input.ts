import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';

@InputType()
export class CreateScheduleInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  objective: string;

  @Field()
  @IsUUID()
  customerId: string;

  @Field()
  @IsUUID()
  doctorId: string;

  @Field()
  @IsDateString()
  scheduledAt: string;
}
