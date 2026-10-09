import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import type { Session, SessionData } from 'express-session';

@Injectable()
export class UsersDomain {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  create(input: CreateUserDto) {
    const data = this.repo.create(input);

    return this.repo.save(data);
  }

  findOne(id: string, relations?: FindOptionsRelations<User>) {
    return this.repo.findOne({
      where: {
        id,
      },
      relations,
    });
  }

  findByEmail(email: string) {
    return this.repo.findOne({
      where: {
        email,
      },
    });
  }

  async update(id: string, input: UpdateUserDto) {
    const data = await this.findOne(id);

    if (!data) {
      throw new NotFoundException('User not found');
    }

    Object.assign(data, input);

    return this.repo.save(data);
  }

  async archive(id: string, session: Session & Partial<SessionData>) {
    const data = await this.findOne(id, { admin: true });

    if (!data) {
      throw new NotFoundException('User not found');
    }

    if (data.admin?.isOwner) {
      throw new ForbiddenException('User cannot be archived');
    }

    data.archivedAt = new Date();
    data.archivedById = session.userId ?? null;

    return this.repo.save(data);
  }
}
