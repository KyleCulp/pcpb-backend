import IORedis from 'ioredis';
require("dotenv").config();

const {
	REDIS_HOST,
	REDIS_PORT,
	REDIS_FAMILY,
	REDIS_PASSWORD,
	REDIS_DB
} = process.env;

const IORedisConfig = {
	port: parseInt(REDIS_PORT!),
	host: REDIS_HOST,
	family: parseInt(REDIS_FAMILY!),
	password: REDIS_PASSWORD,
	db: parseInt(REDIS_DB!)
}

export const redisInstance = async () => {
	return new IORedis(IORedisConfig);
} 

