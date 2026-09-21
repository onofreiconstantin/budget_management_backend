import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from './users.entity';
import { SignInDto } from './dtos/sign-in.dto';
import type { Session as ExpressSession, SessionData } from 'express-session';

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
  signup(
    @Body() body: CreateUserDto,
    @Session() session: ExpressSession & Partial<SessionData>,
  ) {
    return this.authService.signup(body, session);
  }

  @Post('signin')
  signin(
    @Body() body: SignInDto,
    @Session() session: ExpressSession & Partial<SessionData>,
  ) {
    return this.authService.signin(body, session);
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOneOrFail(id);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
}
