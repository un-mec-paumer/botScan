import { z } from 'zod';

export const DisplayUserDto = z.object({
    id: z.string().uuid(),
    username: z.string(),
    email: z.string(),
});

export type DisplayUserDtoType = z.infer<typeof DisplayUserDto>;
