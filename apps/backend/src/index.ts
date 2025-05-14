import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { json } from 'body-parser';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { UserService } from './services/user.service';
import { ApolloContext, ExpressContext } from './types/context';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

// Load environment variables
const env = dotenv.config();

if (!env.parsed?.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const JWT_SECRET = env.parsed?.JWT_SECRET || 'your-secret-key';

async function startServer() {
  const app = express();
  const userService = new UserService();
  await userService.initialize();

  // Middleware
  app.use(cors());
  app.use(json());

  // Auth routes
  app.use('/api/auth', authRoutes);

  const server = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers,
    formatError: (error) => {
      // Remove stack trace in production
      if (process.env.NODE_ENV === 'production') {
        delete error.extensions?.stacktrace;
      }
      return error;
    },
  });

  await server.start();

  app.use(
    '/api/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }: ExpressContext): Promise<ApolloContext> => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          return { user: null };
        }

        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
          const user = await userService.findById(decoded.userId);
          return { user };
        } catch (error) {
          return { user: null };
        }
      },
    })
  );

  // Health check endpoint
  app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
    console.log(`Auth endpoints available at http://localhost:${PORT}/api/auth`);
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
}); 