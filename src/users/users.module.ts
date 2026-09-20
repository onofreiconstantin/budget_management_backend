import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { UsersDomain } from './users.domain';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersDomain, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
