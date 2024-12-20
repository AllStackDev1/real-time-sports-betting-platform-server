import { injectable, inject } from 'inversify';

import { TYPES } from 'di/types';
import { OddsModel, OddsModelDto } from 'db/models';
import { BaseRepository } from './base.repository';

@injectable()
export class OddsRepository extends BaseRepository<OddsModelDto, OddsModel> {
  constructor(@inject(TYPES.OddsModel) protected model: typeof OddsModel) {
    super(model);
  }
}
