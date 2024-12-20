import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from 'di/types';
import { UserModel, BetModel, GameModel, OddsModel } from 'db/models';

const initializeModule = (bind: interfaces.Bind) => {
  bind(TYPES.UserModel).toFunction(UserModel);
  bind(TYPES.BetModel).toFunction(BetModel);
  bind(TYPES.GameModel).toFunction(GameModel);
  bind(TYPES.OddsModel).toFunction(OddsModel);
};

export const ModelsModule = new ContainerModule(initializeModule);
