import { Field, ID, InputType } from '@nestjs/graphql';
import { Gender } from '@prisma/client';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class UpdatePatientInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(16, 16, { message: 'NIK must be exactly 16 characters' })
  nik?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fullName?: string;

  @Field(() => Gender, { nullable: true })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;
}
