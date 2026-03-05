import { z } from 'zod';

export const ErrorDto = z
  .object({
    error: z.string(),
  });

export type ErrorDtoType = z.infer<typeof ErrorDto>;
