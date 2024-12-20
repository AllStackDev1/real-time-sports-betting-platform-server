import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from 'di/types';
import {
  BetService,
  AuthService,
  IBetService,
  UserService,
  GameService,
  IGameService,
  IAuthService,
  IUserService,
  RedisService,
  SocketService,
  SimulationService,
} from 'services';

const initializeModule = (bind: interfaces.Bind) => {
  bind(TYPES.RedisService).to(RedisService).inSingletonScope();
  bind(TYPES.SocketService).to(SocketService).inSingletonScope();
  bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
  bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
  bind<IBetService>(TYPES.BetService).to(BetService).inSingletonScope();
  bind<IGameService>(TYPES.GameService).to(GameService).inSingletonScope();
  bind<SimulationService>(TYPES.SimulationService)
    .to(SimulationService)
    .inSingletonScope();
};

export const ServicesModule = new ContainerModule(initializeModule);
