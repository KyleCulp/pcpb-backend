import { RedisStore as IRedisStore } from 'connect-redis';
import session = require('express-session');
import { Application } from 'express';
const RedisStore = require('connect-redis')(session);
require("dotenv").config();


export const installSession = async (app: Application) => {
	const redisClient = app.get("redisSession");
	const sessionStore: IRedisStore = new RedisStore({
		client: redisClient
	})

	const sessionMiddleware = session({
		name: 'pcpbsid',
		rolling: false,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 10000000,
			sameSite: true,
			httpOnly: true
		},		
		store: sessionStore,
		secret: process.env.JWT_SECRET! //process.env.JWT_SECRET!,
	});

	console.log('lol')

	app.use(sessionMiddleware);
	app.get("websocketMiddlewares").push(sessionMiddleware);
};

