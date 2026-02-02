import { Field, InputType } from '@nestjs/graphql';
import { Gender } from '@prisma/client';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreatePatientInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(16, 16, { message: 'NIK must be exactly 16 characters' })
  nik: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @Field(() => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Field()
  @IsNotEmpty()
  @IsDate()
  dateOfBirth: Date;

  @Field()
  @IsNotEmpty()
  @IsString()
  address: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
