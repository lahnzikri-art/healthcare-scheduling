import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Gender } from '@prisma/client';

registerEnumType(Gender, { name: 'Gender' });

@ObjectType()
export class Patient {
  @Field(() => ID)
  id: string;

  @Field()
  nik: string;

  @Field()
  fullName: string;

  @Field(() => Gender)
  gender: Gender;

  @Field()
  dateOfBirth: Date;

  @Field()
  address: string;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
