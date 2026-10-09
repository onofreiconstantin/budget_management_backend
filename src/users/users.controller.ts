import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  ParseUUIDPipe,
  Delete,
  Session,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { User } from './users.entity';
import { SignInDto } from './dtos/sign-in.dto';
import type { Session as ExpressSession, SessionData } from 'express-session';
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  signout(@Session() session: ExpressSession & Partial<SessionData>) {
    return this.authService.signout(session);
  }

  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  signup(@Body() body: CreateUserDto, @Req() req: Request) {
    return this.authService.signup(body, req);
  }

  @Post('signin')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  signin(@Body() body: SignInDto, @Req() req: Request) {
    return this.authService.signin(body, req);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOneOrFail(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  archiveUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: ExpressSession & Partial<SessionData>,
  ) {
    return this.usersService.archive(id, session);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }
}
