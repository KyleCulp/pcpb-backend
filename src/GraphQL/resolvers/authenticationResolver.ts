import { Pool, Client } from 'pg';
import { isEmail } from '../../utils';

const { makeExtendSchemaPlugin, gql } = require('graphile-utils');

// This file is tab city oml

export const authenticationResolver = makeExtendSchemaPlugin(build => ({
  typeDefs: gql`
    input RegisterInput {
      username: String!
      email: String!
      password: String!
    }

    type RegisterPayload {
      user: UserAccount! @pgField
    }

    input LoginInput {
      username: String!
      password: String!
    }

    type LoginPayload {
      user: UserAccount! @pgField
    }

    extend type Mutation {
      register(input: RegisterInput!): RegisterPayload
      login(input: LoginInput!): LoginPayload
    }
  `,
  resolvers: {
    Mutation: {
      async register(
        mutation,
        args,
        context,
        resolveInfo,
        { selectGraphQLResultFromTable }
      ) {
        const { username = null, password, email } = args.input;
        const pgMasterAdminPool: Pool = context.pgMasterAdminPool;
        const pgClient: Client = context.pgClient;
        const { login } = context;

        try {
          // Call our register function from the database
          const {
            rows: [user]
          } = await pgMasterAdminPool.query(
            `select user_account.* from app_public.register_user (
              username => $1,
              email => $2,
              password => $3
            ) user_account where not (user_account is null)`,
            [username, email, password]
          );

          if (!user) throw new Error('Registration failed.');

          const sql = build.pgSql;

          const results = await Promise.all([
            // Fetch the data that was requested from GraphQL, and return it
            selectGraphQLResultFromTable(
              sql.fragment`app_public.user_account`,
              (tableAlias, sqlBuilder) => {
                sqlBuilder.where(
                  sql.fragment`${tableAlias}.user_id = ${sql.value(
                    user.user_id
                  )}`
                );
              }
            ),

            // Tell Passport.js we're logged in
            login(user),

            // Tell pg we're logged in
            pgClient.query('select set_config($1, $2, true);', [
              'jwt.claims.user_id',
              user.user_id
            ])
          ]);

          const [row] = results[0];
          return {
            data: row
          };
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      async login(
        mutation,
        args,
        context,
        resolveInfo,
        { selectGraphQLResultFromTable }
      ) {
        const { username, password } = args.input;
        const pgMasterAdminPool: Pool = context.pgMasterAdminPool;
        const pgClient: Client = context.pgClient;
        const { login } = context;

        let loginSQL: string;
        if (isEmail(username)) {
          loginSQL = `select user_account.* from app_private.authenticate_by_email($1, $2) user_account where not (user_account is null)`;
        } else {
          loginSQL = `select user_account.* from app_private.authenticate_by_username($1, $2) user_account where not (user_account is null)`;
        }
        try {
          // Call our login function to find out if the username/password combination exists
          const {
            rows: [user]
          } = await pgMasterAdminPool.query(loginSQL, [username, password]);

          if (!user) {
            throw new Error('Login failed');
          }

          const sql = build.pgSql;

          const results = await Promise.all([
            // Fetch the data that was requested from GraphQL, and return it
            selectGraphQLResultFromTable(
              sql.fragment`app_public.user_account`,
              (tableAlias, sqlBuilder) => {
                sqlBuilder.where(
                  sql.fragment`${tableAlias}.user_id = ${sql.value(
                    user.user_id
                  )}`
                );
              }
            ),

            // Tell Passport.js we're logged in
            login(user),

            // Tell pg we're logged in
            pgClient.query('select set_config($1, $2, true);', [
              'jwt.claims.user_id',
              user.user_id
            ])
          ]);

          const [row] = results[0];
          return {
            data: row
          };
        } catch (e) {
          console.error(e);
          throw e;
        }
      }
    }
  }
}));
