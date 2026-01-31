import { z } from 'zod';

export const RegisterUserRequestDto = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  username: z.string().min(3).max(32).optional(),
});

export type RegisterUserRequestDtoType = z.infer<typeof RegisterUserRequestDto>;
