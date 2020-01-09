import { installSession } from './Session';
import { installDatabasePools } from './DatabasePools';
import { installPostgraphile } from './Postgraphile';
import { installPassport } from './Passport';
import { Application } from 'express';

export const installMiddleware = async (app: Application) => {

	/*
	* When we're using websockets, we may want them to have access to
	* sessions/etc for authentication.
	*/
	const websocketMiddlewares = [];
	app.set("websocketMiddlewares", websocketMiddlewares);
	
	/*
	* Middleware installation requires a specific order
	*/
	await installDatabasePools(app);
	await installSession(app);
	await installPassport(app);
	await installPostgraphile(app);
}