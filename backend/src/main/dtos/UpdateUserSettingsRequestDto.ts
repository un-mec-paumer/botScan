import { z } from 'zod';

export const UpdateUserSettingsRequestDto = z
  .object({
  })
  .strip();

export type UpdateUserSettingsRequestDtoType = z.infer<
  typeof UpdateUserSettingsRequestDto
>;
