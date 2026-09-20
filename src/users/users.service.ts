import { Injectable } from '@nestjs/common';
import { UsersDomain } from './users.domain';
@Injectable()
export class UsersService {
  constructor(private readonly usersDomain: UsersDomain) {}

  findAll() {
    return this.usersDomain.findAll();
  }
}
