import { DefaultUser, DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: DefaultUser & {
      role: string;
      firstName?: string;
      lastName?: string;
      username?: string;
    };
  }

  interface User extends DefaultUser {
    role: string;
    firstName?: string;
    lastName?: string;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
    firstName?: string;
    lastName?: string;
    username?: string;
  }
}
