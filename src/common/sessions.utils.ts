import type { Session } from 'express-session';

export const regenerateSession = (session: Session) =>
  new Promise<void>((resolve, reject) => {
    session.regenerate((error: Error | undefined) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

export const destroySession = (session: Session) =>
  new Promise<void>((resolve, reject) => {
    session.destroy((error: Error | undefined) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
