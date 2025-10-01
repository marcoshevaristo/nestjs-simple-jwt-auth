import { z } from 'zod';

export const loginRequestDTOSchema = z.object({
  id: z.uuid(),
  email: z.email(),
});

export type LoginRequestDTO = z.infer<typeof loginRequestDTOSchema>;
