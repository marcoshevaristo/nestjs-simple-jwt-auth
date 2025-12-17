import { z } from 'zod';

export const loginRequestDTOSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginRequestDTO = z.infer<typeof loginRequestDTOSchema>;
