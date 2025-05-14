import { UserEntity } from '../entities/user.entity';

export interface ApolloContext {
  user: UserEntity | null;
}

export interface ExpressContext {
  req: {
    headers: {
      authorization?: string;
    };
  };
} 