// Lots of stuff from Graphile's bootstrap-react-apollo repo
// Including comments, so props to graphile

import postgraphile, { enhanceHttpServerWithSubscriptions } from 'postgraphile';
import { Application } from 'express';
import { PostgraphileInstance } from '../graphql/postgraphile';
import PgManyToManyPlugin from '@graphile-contrib/pg-many-to-many';
import { pgMasterPool } from '../database';
import { getUserClaimsFromRequest } from './installPassport';
import { graphqlResolvers } from '../graphql/resolvers';

const postgraphilePlugins = [PgManyToManyPlugin];
const postgraphileResolvers = graphqlResolvers();

export const installPostgraphile = async (app: Application) => {
  const { schemas, postgraphileOptions } = PostgraphileInstance;
  const websocketMiddlewares = app.get('websocketMiddlewares');
  const appendedOptions = {
    ...postgraphileOptions,
    ...websocketMiddlewares,
    appendPlugins: postgraphilePlugins.concat(postgraphileResolvers),

    /* Postgres transaction settings for each GraphQL query/mutation to
     * indicate to Postgres who is attempting to access the resources. These
     * will be referenced by RLS policies/triggers/etc.
     *
     * Settings set here will be set using the equivalent of `SET LOCAL`, so
     * certain things are not allowed. You can override Postgres settings such
     * as 'role' and 'search_path' here; but for settings indicating the
     * current user, session id, or other privileges to be used by RLS policies
     * the setting names must contain at least one and at most two period
     * symbols (`.`), and the first segment must not clash with any Postgres or
     * extension settings. We find `jwt.claims.*` to be a safe namespace,
     * whether or not you're using JWTs.
     */
    async pgSettings(req) {
      const claims = await getUserClaimsFromRequest(req);
      return {
        // Everyone uses the "visitor" role currently
        role: process.env.DATABASE_VISITOR,

        // If there are any claims, then add them into the session.
        // Although this is pretty catch all, it's just going to be
        // receiving a claim of the user_id, and nothing else in this app
        ...Object.entries(claims).reduce((memo, [key, value]) => {
          if (!key.match(/^[a-z][a-z0-9A-Z-_]+$/)) {
            throw new Error('Invalid claim key.');
          }

          /*
           * Note, though this says "jwt" it's not actually anything to do with
           * JWTs, we just know it's a safe namespace to use, and it means you
           * can use JWTs too, if you like, and they'll use the same settings
           * names reducing the amount of code you need to write.
           */
          memo[`jwt.claims.${key}`] = value;
          return memo;
        }, {})
      };
      // return {
      //   role: 'app_anonymous',
      //   'jwt.claims.user_id': req.ctx.state.user && req.ctx.state.user.user_id
      // };
    },

    async additionalGraphQLContextFromRequest(req) {
      const pgMasterAdminPool = app.get('pgMasterAdminPool');
      const claims = await getUserClaimsFromRequest(req);

      return {
        claims,
        pgMasterAdminPool,
        login: user => {
          if (!user) throw new Error('user argument is required');
          return new Promise((resolve, reject) => {
            req.login(user, err => {
              if (err) reject(new Error(err));
              resolve(user);
            });
          });
        }
      };
    }
  };

  // Install the PostGraphile middleware
  const postgraphileMiddleware = postgraphile(
    pgMasterPool,
    schemas,
    appendedOptions
  );

  app.use(postgraphileMiddleware);
};
