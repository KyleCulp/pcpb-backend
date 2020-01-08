import 'reflect-metadata';

import chalk from 'chalk';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { createServer } from 'http';
import { checkEnvironmentVariables } from './Utils/EnvironmentVarCheck';
import { installMiddleware } from './Middleware';

const PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000;

(async () => {
	const app: Express = express();
	// Run at beginning, ensuring a faulty deploy
	// won't connect to the Database, wasting connections
	// checkEnvironmentVariables();

	/*
	* Getting access to the HTTP server directly means that we can do things
	* with websockets if we need to (e.g. GraphQL subscriptions).
	*/
	const httpServer = createServer(app);
	app.set("httpServer", httpServer);

	/*
	* When we're using websockets, we may want them to have access to
	* sessions/etc for authentication.
	*/
	const websocketMiddlewares = [];
	app.set("websocketMiddlewares", websocketMiddlewares);

	/*
	*  Install middleware in middleware folder
	*/
	// installMiddleware(app);

	app.use(cookieParser());
	app.use(compress());
	app.use(
		cors({
			origin: 'localhost:3000',
			credentials: true
		})
	);

	app.get('/', async (req, res) => {
		res.send(200);
	})

	app.get('/health', async (req, res) => {
		res.send(200);
	});


	httpServer.listen(PORT, () => {
		const address = httpServer.address();
		const actualPort = typeof address === "string" ? address : address?.port || PORT;
		console.log();
		console.log(
			chalk.green(
				`${chalk.bold('PCPartBuilder API')} listening on port ${chalk.bold(
				actualPort
				)}`
			)
		);
	});
	
})();
