import { scrypt as _scrypt, BinaryLike } from 'crypto';
import { promisify } from 'util';

export const scrypt = promisify(_scrypt) as (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
) => Promise<Buffer>;

export const PASSWORD_SEPARATOR = '.';
export const PASSWORD_HASH_LENGTH = 32;
