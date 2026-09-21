import { BadRequestException, Injectable } from '@nestjs/common';
import type { Session, SessionData } from 'express-session';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { randomBytes } from 'crypto';
import {
  PASSWORD_HASH_LENGTH,
  PASSWORD_SEPARATOR,
  scrypt,
} from './utils/password.utils';
import { UsersDomain } from './users.domain';

@Injectable()
export class AuthService {
  constructor(private readonly usersDomain: UsersDomain) {}

  async signup(input: CreateUserDto, session: Session & Partial<SessionData>) {
    const { email, password, ...rest } = input;

    const exists = await this.usersDomain.find(email);

    if (exists.length) {
      throw new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = await scrypt(password, salt, PASSWORD_HASH_LENGTH);

    const result = salt + PASSWORD_SEPARATOR + hash.toString('hex');

    const data = await this.usersDomain.create({
      email,
      password: result,
      ...rest,
    });

    session.userId = data.id;

    return data;
  }

  async signin(input: SignInDto, session: Session & Partial<SessionData>) {
    const { email, password } = input;

    const [exists] = await this.usersDomain.find(email);

    if (!exists) {
      throw new BadRequestException('Invalid credentials');
    }

    const [salt, storedHash] = exists.password.split(PASSWORD_SEPARATOR);

    const hash = await scrypt(password, salt, PASSWORD_HASH_LENGTH);

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }

    session.userId = exists.id;

    return exists;
  }

  async signout(session: Session & Partial<SessionData>) {
    await new Promise<void>((resolve, reject) => {
      session.destroy((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}
