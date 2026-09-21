import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

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

  find(email: string) {
    return this.repo.find({
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

  async remove(id: string) {
    const data = await this.findOne(id);

    if (!data) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(data);
  }
}
