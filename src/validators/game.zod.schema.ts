import z from 'zod';

import { isEmpty } from 'utils/helper';

const OddsCreateSchema = z.object({
  home: z.number().int().positive(),
  away: z.number().int().positive(),
  draw: z.number().int().positive(),
  gameId: z.string().min(1),
});

export const OddsUpdateSchema = z
  .object({
    home: z.number().int().positive().optional(),
    away: z.number().int().positive().optional(),
    draw: z.number().int().positive().optional(),
  })
  .partial()
  .refine((data) => !isEmpty(data), {
    message: 'One of the fields must be defined',
    path: ['home', 'away', 'draw'],
  });

export type OddsUpdateSchema = z.infer<typeof OddsUpdateSchema>;

export const GameCreateSchema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  timeRemaining: z.string().min(1),
  homeScore: z.number().int().positive(),
  awayScore: z.number().int().positive(),
  odds: OddsCreateSchema,
});

export type GameCreateSchema = z.infer<typeof GameCreateSchema>;

export const GameQuerySchema = z.object({
  homeTeam: z.string().min(1).optional(),
  awayTeam: z.string().min(1).optional(),
  timeRemaining: z.string().min(1).optional(),
  homeScore: z.number().int().positive().optional(),
  awayScore: z.number().int().positive().optional(),
});

export type GameQuerySchema = z.infer<typeof GameQuerySchema>;

export const GameUpdateSchema = z
  .object({
    homeTeam: z.string().min(1).optional(),
    awayTeam: z.string().min(1).optional(),
    timeRemaining: z.string().min(1).optional(),
    homeScore: z.number().int().positive().optional(),
    awayScore: z.number().int().positive().optional(),
    // odds: OddsUpdateSchema.optional(),
  })
  .partial()
  .refine((data) => !isEmpty(data), {
    message: 'One of the fields must be defined',
    path: [
      'homeTeam',
      'awayTeam',
      'timeRemaining',
      'homeScore',
      'awayScore',
      'odds',
    ],
  });

export type GameUpdateSchema = z.infer<typeof GameUpdateSchema>;
