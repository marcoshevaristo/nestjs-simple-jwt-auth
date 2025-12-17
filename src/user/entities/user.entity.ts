import { z } from 'zod';

export const userEntitySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type UserEntity = z.infer<typeof userEntitySchema>;
