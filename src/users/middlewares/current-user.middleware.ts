import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Request, Response, NextFunction } from 'express';
import { destroySession } from '../../common/sessions.utils';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const { userId } = req.session;

    if (userId) {
      const user = await this.usersService.findOne(userId, {
        admin: true,
      });

      if (!user || user.archivedAt) {
        await destroySession(req.session);

        return next();
      }

      req.currentUser = user;
    }

    next();
  }
}
