import z from 'zod';

export * from './bet.zod.schema';
export * from './user.zod.schema';
export * from './game.zod.schema';

export const ParamsWithId = z.object({
  id: z.string().uuid(),
});

export type ParamsWithId = z.infer<typeof ParamsWithId>;

export const DeleteTypeSchema = z.object({
  type: z.enum(['soft', 'force']),
});

export type DeleteTypeSchema = z.infer<typeof DeleteTypeSchema>;
