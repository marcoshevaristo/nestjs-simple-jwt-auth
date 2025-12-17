import { z } from 'zod';
import { userEntitySchema } from '@user/entities/user.entity';

export const registerRequestDTOSchema = z.object({
  id: z.uuid(),
  name: userEntitySchema.shape.name,
  email: userEntitySchema.shape.email,
  password: userEntitySchema.shape.password,
});

export type RegisterRequestDTO = z.infer<typeof registerRequestDTOSchema>;
