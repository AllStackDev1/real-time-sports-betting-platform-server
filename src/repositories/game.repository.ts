import { injectable, inject } from 'inversify';

import { TYPES } from 'di/types';
import { GameModel, GameModelDto } from 'db/models';
import { BaseRepository } from './base.repository';

@injectable()
export class GameRepository extends BaseRepository<GameModelDto, GameModel> {
  constructor(@inject(TYPES.GameModel) protected model: typeof GameModel) {
    super(model);
  }
}
