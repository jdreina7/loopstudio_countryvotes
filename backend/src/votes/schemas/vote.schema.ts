import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VoteDocument = HydratedDocument<Vote>;

@Schema({ timestamps: true })
export class Vote {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  countryName: string;

  @Prop({ required: true })
  flag: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
