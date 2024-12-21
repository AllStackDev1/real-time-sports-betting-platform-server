import { NOT_FOUND } from 'http-status';
import { injectable, inject } from 'inversify';
import { col, fn, literal, Op } from 'sequelize';
import { useAdapter } from '@type-cacheable/ioredis-adapter';

import { TYPES } from 'di/types';
import { AppError } from 'utils';
import { BaseService } from './base.service';
import { BetRepository, UserRepository } from 'repositories';
import { RedisService } from './redis.service';
import {
  BetModel,
  BetModelDto,
  GameModel,
  UserModel,
  UserModelDto,
} from 'db/models';
import {
  BetStatus,
  type BetCreateSchema,
  type BetQuerySchema,
} from 'validators';

interface ILeaderboard {
  rank: number;
  userId: string;
  winRate: number;
  user: UserModelDto;
  totalWinnings: number;
}

export interface IBetService {
  create(dto: BetCreateSchema): Promise<BetModelDto>;
  getLeaderboard(): Promise<ILeaderboard[]>;
  getBetById(id: string): Promise<BetModelDto | null>;
  getBetsByQuery(
    query: BetQuerySchema,
  ): Promise<{ data: BetModelDto[]; message: string }>;
}

@injectable()
export class BetService extends BaseService implements IBetService {
  constructor(
    @inject(TYPES.BetRepository)
    protected repo: BetRepository,
    @inject(TYPES.UserRepository)
    protected userRepo: UserRepository,
    @inject(TYPES.RedisService)
    redisService: RedisService,
  ) {
    super();
    useAdapter(
      redisService.getClient({
        enableOfflineQueue: true,
      }),
      false,
      { ttlSeconds: 3600 },
    );
  }

  private include = {
    include: [
      {
        model: GameModel,
        as: 'game',
      },
    ],
  };

  public async create(dto: BetCreateSchema) {
    const bet = await this.repo.create(dto);
    await this.userRepo.updateById(dto.userId, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      balance: literal(`balance - ${dto.amount}`) as any,
    });
    return (await this.repo.getById(
      bet.id as string,
      this.include,
    )) as BetModel;
  }

  public async getBetById(id: string) {
    // run some formating and all need data manipulation
    const bet = await this.repo.getById(id, this.include);
    if (bet) return bet;
    throw new AppError('No user found', NOT_FOUND);
  }

  public async updateById(id: string, data: Partial<BetModelDto>) {
    const bet = await this.repo.updateById(id, data);
    if (!bet) throw new AppError('Bet not found', NOT_FOUND);
    return bet;
  }

  public async getBetsByQuery(query: BetQuerySchema) {
    const bets = await this.repo.getAll(query, this.include);
    return {
      data: bets,
      message: `${bets.length} bet${bets.length > 1 ? 's' : ''} found.`,
    };
  }

  public async getLeaderboard() {
    const W1 = 0.8; // Weight for Win Rate
    const W2 = 0.4; // Weight for Total Winnings

    // run some formating and all need data manipulation
    const results = (await this.repo.getAll(
      {
        status: {
          [Op.ne]: BetStatus.PENDING, // Exclude pending transactions
        },
      },
      {
        attributes: [
          'userId',
          [col('user.username'), 'username'],
          [
            fn(
              'SUM',
              literal("CASE WHEN status = 'won' THEN amount * odds ELSE 0 END"),
            ),
            'totalWinnings',
          ],
          [
            literal(`
              CAST(SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) AS FLOAT) / 
              CAST(COUNT(*) AS FLOAT) * 100
            `),
            'winRate',
          ],
          [
            literal(`
              RANK() OVER (
                ORDER BY 
                  ((CAST(SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) AS FLOAT) / 
                    CAST(COUNT(*) AS FLOAT) * 100) * ${W1} +
                  (SUM(CASE WHEN status = 'won' THEN amount * odds ELSE 0 END)) * ${W2}) DESC
              )
            `),
            'rank',
          ],
        ],
        include: [
          {
            model: UserModel,
            as: 'user',
            attributes: ['username'],
            required: true,
          },
        ],
        group: ['userId', 'user.id', 'user.username'],
        order: [['rank', 'ASC']],
        raw: true,
        nest: true,
      },
    )) as unknown as ILeaderboard[];

    if (results) return results;
    throw new AppError('No bet found', NOT_FOUND);
  }
}
