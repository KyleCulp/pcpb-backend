import { Pool } from "pg"
import { Application } from "express";
import { redisInstance } from "../Database";


const {
	DB_ROOT_USERNAME,
	DB_ROOT_PASSWORD,
	DB_USERNAME,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_NAME
} = process.env;

const rootPgString = `postgres://${DB_ROOT_USERNAME}:${DB_ROOT_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const authPgString = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;


export const installDatabasePools = async (app: Application) => {
	// Admin Account Connection
	const rootPgPool = new Pool({
		connectionString: rootPgString
	});
	app.set("rootPgPool", rootPgPool);

	// User Account Connection
	const authPgPool = new Pool({
		connectionString: authPgString
	});
	app.set("authPgPool", authPgPool);

	const redisSession = await redisInstance();
	app.set("redisSession", redisSession)
}