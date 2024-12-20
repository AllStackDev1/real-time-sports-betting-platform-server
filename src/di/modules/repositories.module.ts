import { ContainerModule, interfaces } from 'inversify';
import {
  UserRepository,
  BetRepository,
  OddsRepository,
  GameRepository,
} from 'repositories';

import { TYPES } from 'di/types';

const initializeModule = (bind: interfaces.Bind) => {
  bind<UserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();
  bind<BetRepository>(TYPES.BetRepository).to(BetRepository).inSingletonScope();
  bind<OddsRepository>(TYPES.OddsRepository)
    .to(OddsRepository)
    .inSingletonScope();
  bind<GameRepository>(TYPES.GameRepository)
    .to(GameRepository)
    .inSingletonScope();
};

export const RepositoriesModule = new ContainerModule(initializeModule);
