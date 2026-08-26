import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Mock } from './mock.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MockService {
  constructor(
    @InjectRepository(Mock)
    private readonly repo: Repository<Mock>,
  ) {}

  findAll(): Promise<Mock[]> {
    return this.repo.find();
  }
}
