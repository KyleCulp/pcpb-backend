import 'reflect-metadata';

import chalk from 'chalk';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { createServer } from 'http';
import { checkEnvironmentVariables } from './utils/checkEnvironmentVariables';
import { installMiddleware } from './middleware';
const health = require('@cloudnative/health-connect');

const PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000;
const healthcheck = new health.HealthChecker();

(async () => {
	const app: Express = express();
	
	// Check if all needed environment variables
	// Are accessible & gracefully stop if any are missing
	checkEnvironmentVariables();
	
	/*
	*	Getting access to the HTTP server directly means that we can do things
	*	with websockets if we need to (e.g. GraphQL subscriptions).
	*/
	const httpServer = createServer(app);
	app.set("httpServer", httpServer);


	// Install middleware in middleware folder
	// installMiddleware(app);

	/*
	*	Cloud Health Liveliness & Readiness Endpoints
	*	Handled by Cloud Health Connect
	*/
	app.use('/live', health.LivenessEndpoint(healthcheck));
	app.use('/ready', health.ReadinessEndpoint(healthcheck));
	app.use('/health', health.HealthEndpoint(healthcheck));

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
