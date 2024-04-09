import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
    email?: string;
  }
}
