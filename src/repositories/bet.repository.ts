import { injectable, inject } from 'inversify';

import { TYPES } from 'di/types';
import { BetModel, BetModelDto } from 'db/models';
import { BaseRepository } from './base.repository';

@injectable()
export class BetRepository extends BaseRepository<BetModelDto, BetModel> {
  constructor(@inject(TYPES.BetModel) protected model: typeof BetModel) {
    super(model);
  }
}
