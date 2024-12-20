import z from 'zod';

export enum TeamType {
  HOME = 'home',
  AWAY = 'away',
  DRAW = 'draw',
}

export enum BetStatus {
  PENDING = 'pending',
  WON = 'won',
  LOST = 'lost',
}

export const BetCreateSchema = z.object({
  gameId: z.string().min(1),
  userId: z.string().min(1),
  odds: z.number().positive(),
  amount: z.number().positive(),
  status: z.nativeEnum(BetStatus).optional(),
  selectedTeam: z.nativeEnum(TeamType),
});

export type BetCreateSchema = z.infer<typeof BetCreateSchema>;

export const BetQuerySchema = z.object({
  gameId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  odds: z.number().positive().optional(),
  amount: z.number().positive().optional(),
  status: z.nativeEnum(BetStatus).optional(),
  selectedTeam: z.nativeEnum(TeamType).optional(),
});

export type BetQuerySchema = z.infer<typeof BetQuerySchema>;
