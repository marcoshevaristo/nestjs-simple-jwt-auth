import { z } from 'zod';
import { userEntitySchema } from '../entities/user.entity';

export const getUserDTOSchema = z.object({
  id: userEntitySchema.shape.id,
  name: userEntitySchema.shape.name,
  email: userEntitySchema.shape.email,
  password: userEntitySchema.shape.password,
});

export type GetUserDTO = z.infer<typeof getUserDTOSchema>;
