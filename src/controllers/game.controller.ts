import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { OK } from 'http-status';

import { TYPES } from 'di/types';
import { IGameService } from 'services';
import { Route, Controller, AuthGuard } from 'decorators';
import { Op } from 'sequelize';

@Controller('/games')
@injectable()
export class GameController {
  constructor(
    @inject(TYPES.GameService)
    private service: IGameService,
  ) {}

  @Route('get', '/')
  @AuthGuard()
  async getLiveAll(_: Request, res: Response) {
    return res.status(OK).json(
      await this.service.getGamesByQuery({
        timeRemaining: { [Op.ne]: 'Final' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
    );
  }
}
