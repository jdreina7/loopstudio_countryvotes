import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateVoteSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Invalid email format'),
  countryCode: z
    .string()
    .length(3, 'Country code must be 3 characters')
    .toUpperCase(),
  countryName: z.string().min(2, 'Country name must be at least 2 characters'),
  flag: z.string().url('Flag must be a valid URL'),
});

export class CreateVoteDto extends createZodDto(CreateVoteSchema) {}
