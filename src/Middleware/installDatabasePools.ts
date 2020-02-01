import { Pool } from 'pg';
import { redisInstance } from '../database';
import { Application } from 'express';

const {
  PG_MASTER_ADMIN_USERNAME,
  PG_MASTER_ADMIN_PASSWORD,
  PG_MASTER_HOST,
  PG_MASTER_PORT,
  PG_MASTER_USERNAME,
  PG_MASTER_PASSWORD,
  PG_MASTER_NAME
} = process.env;

const pgMasterString = `postgres://${PG_MASTER_USERNAME}@${PG_MASTER_HOST}:${PG_MASTER_PORT}/${PG_MASTER_NAME}`;
const pgMasterAdminString = `postgres://${PG_MASTER_ADMIN_USERNAME}@${PG_MASTER_HOST}:${PG_MASTER_PORT}/${PG_MASTER_NAME}`;
// const pgMasterString = `postgres://${PG_MASTER_USERNAME}:${PG_MASTER_PASSWORD}@${PG_MASTER_HOST}:${PG_MASTER_PORT}/${PG_MASTER_NAME}`;
// const pgMasterAdminString = `postgres://${PG_MASTER_ADMIN_USERNAME}:${PG_MASTER_ADMIN_PASSWORD}@${PG_MASTER_HOST}:${PG_MASTER_PORT}/${PG_MASTER_NAME}`;

export const installDatabasePools = async (app: Application) => {
  // User Account Connection
  const pgMasterPool = new Pool({
    connectionString: pgMasterString
  });
  app.set('pgMasterString', pgMasterPool);

  // Admin Account Connection
  const pgMasterAdminPool = new Pool({
    connectionString: pgMasterAdminString
  });
  app.set('pgMasterAdminPool', pgMasterAdminPool);

  const redisSession = await redisInstance();
  app.set('redisSession', redisSession);
};
