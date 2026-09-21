import { User } from './src/users/users.entity';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}
