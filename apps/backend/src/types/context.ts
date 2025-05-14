import { User } from '../models/user.model';

export interface ApolloContext {
  user: User | null;
}

export interface ExpressContext {
  req: {
    headers: {
      authorization?: string;
    };
  };
} 