// import qs from 'node:querystring';
import { injectable, inject } from 'inversify';
import { BAD_REQUEST, NOT_FOUND } from 'http-status';
import { useAdapter } from '@type-cacheable/ioredis-adapter';
import { Cacheable, CacheClear, CacheUpdate } from '@type-cacheable/core';

import { TYPES } from 'di/types';
import { AppError } from 'utils';
import { BaseService } from './base.service';
import { GameRepository, OddsRepository } from 'repositories';
import { RedisService } from './redis.service';
import { GameModelDto, OddsModel } from 'db/models';
import type {
  OddsUpdateSchema,
  GameCreateSchema,
  GameUpdateSchema,
  GameQuerySchema,
} from 'validators';

export interface IGameService {
  create(dto: GameCreateSchema): Promise<GameModelDto>;
  getAllGames(): Promise<{ data: GameModelDto[]; message: string }>;
  getGameById(id: string): Promise<GameModelDto | null>;
  getGamesByQuery(
    query: GameQuerySchema,
  ): Promise<{ data: GameModelDto[]; message: string }>;
  update(id: string, payload: GameUpdateSchema): Promise<GameModelDto | null>;
  updateGameOdds(
    gameId: string,
    payload: OddsUpdateSchema,
  ): Promise<GameModelDto | null>;
  forceDeleteById(id: string): Promise<number>;
}

@injectable()
export class GameService extends BaseService implements IGameService {
  constructor(
    @inject(TYPES.GameRepository)
    protected repo: GameRepository,
    @inject(TYPES.OddsRepository)
    protected oddsRepo: OddsRepository,
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

  public async create(dto: GameCreateSchema) {
    return await this.repo.create(dto);
  }

  public async getAllGames() {
    const games = await this.repo.getAll();
    return {
      data: games,
      message: `${games.length} bet${games.length > 1 ? 's' : ''} found.`,
    };
  }

  public async getGamesByQuery(query: GameQuerySchema) {
    const games = await this.repo.getAll(query, {
      include: [
        {
          model: OddsModel,
          as: 'odds',
        },
      ],
    });
    return {
      data: games,
      message: `${games.length} game${games.length > 1 ? 's' : ''} found.`,
    };
  }

  @Cacheable({ cacheKey: ([id]) => id })
  public async getGameById(id: string) {
    // run some formating and all need data manipulation
    const game = await this.repo.getById(id);
    if (game) return game;
    throw new AppError('No bet found', NOT_FOUND);
  }

  @CacheUpdate({
    cacheKey: (args, ctx, result) => result.id,
    cacheKeysToClear: () => ['games'],
  })
  public async update(id: string, payload: GameUpdateSchema) {
    const [updatedRows] = await this.repo.updateById(id, payload);

    if (updatedRows) {
      const game = await this.repo.getById(id);
      if (game) return game;
    }
    throw new AppError('Unable to update, please try again.', BAD_REQUEST);
  }

  @CacheUpdate({
    cacheKey: (args, ctx, result) => result.id,
    cacheKeysToClear: () => ['games', 'odds'],
  })
  public async updateGameOdds(gameId: string, payload: OddsUpdateSchema) {
    const odds = await this.oddsRepo.getOne({ gameId });
    if (!odds) {
      throw new AppError('Odds not found', NOT_FOUND);
    }

    const updatedRows = await odds.update(payload);

    if (updatedRows) {
      const game = await this.repo.getById(gameId);
      if (game) return game;
    }
    throw new AppError('Unable to update, please try again.', BAD_REQUEST);
  }

  @CacheClear({ cacheKey: ([id]) => [id, 'games'] })
  public async forceDeleteById(id: string) {
    return this.repo.deleteById(id, true);
  }
}
