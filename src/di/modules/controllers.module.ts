import { ContainerModule, interfaces } from 'inversify';
import {
  AuthController,
  BetController,
  GameController,
  UserController,
} from 'controllers';
import { TYPES } from 'di/types';

const initializeModule = (bind: interfaces.Bind) => {
  bind<AuthController>(TYPES.AuthController)
    .to(AuthController)
    .inSingletonScope();
  bind<UserController>(TYPES.UserController)
    .to(UserController)
    .inSingletonScope();
  bind<BetController>(TYPES.BetController).to(BetController).inSingletonScope();
  bind<GameController>(TYPES.GameController)
    .to(GameController)
    .inSingletonScope();
};

export const ControllersModule = new ContainerModule(initializeModule);
