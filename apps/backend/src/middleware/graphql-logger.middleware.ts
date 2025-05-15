import { ApolloServerPlugin } from '@apollo/server';
import Logger from '../config/logger';

export const graphqlLogger: ApolloServerPlugin = {
  async requestDidStart(requestContext) {
    const start = Date.now();
    const { request } = requestContext;
    const operationName = request.operationName || request.query?.split('{')[0]?.trim() || 'unnamed operation';
    const query = request.query;

    Logger.http(`GraphQL Request: ${operationName}`);
    // Logger.debug(`Query: ${query}`);

    return {
      async willSendResponse(requestContext) {
        const duration = Date.now() - start;
        const { response } = requestContext;
        const body = response.body as { errors?: any[] };
        
        if (body.errors?.length) {
          Logger.error(`GraphQL Error in ${operationName}`, {
            errors: body.errors,
            duration: `${duration}ms`,
            operation: operationName,
            query: query
          });
        } else {
          Logger.http(`GraphQL Response: ${operationName}`, {
            duration: `${duration}ms`,
            operation: operationName
          });
        }
      },
    };
  },
}; 