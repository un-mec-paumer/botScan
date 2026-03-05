import { z } from 'zod';

export const LoginUserRequestDto = z
  .object({
    email: z.email(),
    // username: z.string().min(3).max(32).optional(),
    password: z.string().min(4),
  })
  .refine((data) => data.email, {
    message: 'Email must be provided',
    path: ['email'],
  });

export type LoginUserRequestDtoType = z.infer<typeof LoginUserRequestDto>;
