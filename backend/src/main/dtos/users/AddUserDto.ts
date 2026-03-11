import { z } from 'zod';

export const AddUserDto = z.object({
    id: z.string().uuid().optional(),
    username: z.string(),
});

export type AddUserDtoType = z.infer<typeof AddUserDto>;
