import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { OK, CREATED } from 'http-status';

import { BetCreateSchema } from 'validators';
import { TYPES } from 'di/types';
import { IBetService } from 'services';
import { Route, Controller, Validator, AuthGuard } from 'decorators';

@Controller('/bets')
@injectable()
export class BetController {
  constructor(
    @inject(TYPES.BetService)
    private service: IBetService,
  ) {}

  @Route('get', '/')
  @AuthGuard()
  async getAll(req: Request, res: Response) {
    const userId = req.session.user?.id || req.user?.dataValues?.id;
    return res.status(OK).json(await this.service.getBetsByQuery({ userId }));
  }

  @Route('post', '/')
  @AuthGuard()
  @Validator({ body: BetCreateSchema })
  async create(req: Request<[], BetCreateSchema>, res: Response) {
    return res.status(CREATED).json({
      data: await this.service.create(req.body),
      message: 'Bet created successfully.',
    });
  }

  @Route('get', '/leaderboard')
  @AuthGuard()
  async getById(_: Request, res: Response) {
    return res.status(OK).json({ data: await this.service.getLeaderboard() });
  }
}
