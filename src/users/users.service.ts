import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersDomain } from './users.domain';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FindOptionsRelations } from 'typeorm';
import { User } from './users.entity';
import type { Session, SessionData } from 'express-session';
@Injectable()
export class UsersService {
  constructor(private readonly usersDomain: UsersDomain) {}

  create(input: CreateUserDto) {
    return this.usersDomain.create(input);
  }

  findOne(id: string, relations?: FindOptionsRelations<User>) {
    return this.usersDomain.findOne(id, relations);
  }

  async findOneOrFail(id: string) {
    const user = await this.usersDomain.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  update(id: string, input: UpdateUserDto) {
    return this.usersDomain.update(id, input);
  }

  archive(id: string, session: Session & Partial<SessionData>) {
    return this.usersDomain.archive(id, session);
  }
}
