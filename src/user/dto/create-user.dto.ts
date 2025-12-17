import { z } from 'zod';
import { userEntitySchema } from '../entities/user.entity';

export const createUserDTOSchema = z.object({
  name: userEntitySchema.shape.name,
  email: userEntitySchema.shape.email,
  password: userEntitySchema.shape.password,
});

export type CreateUserDTO = z.infer<typeof createUserDTOSchema>;
