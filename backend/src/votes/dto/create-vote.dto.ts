import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  VOTE_NAME_MIN_LENGTH,
  VOTE_NAME_MAX_LENGTH,
  COUNTRY_CODE_LENGTH,
  COUNTRY_NAME_MIN_LENGTH,
} from '../../utils/constants';

const CreateVoteSchema = z.object({
  name: z
    .string()
    .min(VOTE_NAME_MIN_LENGTH, 'Name must be at least 2 characters')
    .max(VOTE_NAME_MAX_LENGTH, 'Name must not exceed 100 characters'),
  email: z.string().email('Invalid email format'),
  countryCode: z
    .string()
    .length(COUNTRY_CODE_LENGTH, 'Country code must be 3 characters')
    .toUpperCase(),
  countryName: z
    .string()
    .min(COUNTRY_NAME_MIN_LENGTH, 'Country name must be at least 2 characters'),
  flag: z.string().url('Flag must be a valid URL'),
});

export class CreateVoteDto extends createZodDto(CreateVoteSchema) {}
