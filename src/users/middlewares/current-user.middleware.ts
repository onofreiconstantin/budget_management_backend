import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const { userId } = req.session;

    if (userId) {
      const user = await this.usersService.findOne(userId, {
        admin: true,
      });

      if (!user) {
        await new Promise<void>((resolve, reject) => {
          req.session.destroy((error) => {
            if (error) {
              reject(error);
              return;
            }

            resolve();
          });
        });

        return next();
      }

      req.currentUser = user;
    }

    next();
  }
}
