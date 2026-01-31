import { z } from 'zod';

export const RefreshTokenRequestDto = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenRequestDtoType = z.infer<typeof RefreshTokenRequestDto>;
