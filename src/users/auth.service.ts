import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Session, SessionData } from 'express-session';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { randomBytes, timingSafeEqual } from 'crypto';
import {
  PASSWORD_HASH_LENGTH,
  PASSWORD_SEPARATOR,
  scrypt,
} from './utils/password.utils';
import { UsersDomain } from './users.domain';
import { destroySession, regenerateSession } from '../common/sessions.utils';

@Injectable()
export class AuthService {
  constructor(private readonly usersDomain: UsersDomain) {}

  async signup(input: CreateUserDto, req: Request) {
    const { email, password, ...rest } = input;

    const exists = await this.usersDomain.findByEmail(email);

    if (exists) {
      throw new BadRequestException(
        exists.archivedAt ? 'Something went wrong' : 'Email in use',
      );
    }

    const salt = randomBytes(16).toString('hex');

    const hash = await scrypt(password, salt, PASSWORD_HASH_LENGTH);

    const result = salt + PASSWORD_SEPARATOR + hash.toString('hex');

    const data = await this.usersDomain.create({
      email,
      password: result,
      ...rest,
    });

    await regenerateSession(req.session);

    req.session.userId = data.id;

    return data;
  }

  async signin(input: SignInDto, req: Request) {
    const { email, password } = input;

    const exists = await this.usersDomain.findByEmail(email);

    if (!exists || exists.archivedAt) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [salt, storedHash] = exists.password.split(PASSWORD_SEPARATOR);

    const storedBuffer = Buffer.from(storedHash, 'hex');

    const hash = await scrypt(password, salt, PASSWORD_HASH_LENGTH);

    if (
      storedBuffer.length !== hash.length ||
      !timingSafeEqual(storedBuffer, hash)
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await regenerateSession(req.session);

    req.session.userId = exists.id;

    return exists;
  }

  signout(session: Session & Partial<SessionData>) {
    return destroySession(session);
  }
}
