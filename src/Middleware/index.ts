import { installSession } from './Session';
import { installDatabasePools } from './DatabasePools';
import { installPostgraphile } from './Postgraphile';
import { installPassport } from './Passport';
import { Application } from 'express';

export const installMiddleware = async (app: Application) => {
	/*
	* Middleware installation requires a specific order
	*/
	await installDatabasePools(app);
	await installSession(app);
	await installPassport(app);
	await installPostgraphile(app);
}