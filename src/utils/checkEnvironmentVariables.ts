require('dotenv').config();

/*
 *	Check that all environmental variables are present, and throw
 *   an error before continuing if checks fail. This prevents
 *	needless connections to the database, and a faster restart
 */

enum EnvironmentalVariables {
  NODE_ENV,
  PG_MASTER_HOST,
  PG_MASTER_PORT,
  PG_MASTER_USERNAME,
  PG_MASTER_PASSWORD,
  PG_MASTER_NAME,
  PG_MASTER_ADMIN_USERNAME,
  PG_MASTER_ADMIN_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_FAMILY,
  REDIS_PASSWORD,
  REDIS_DB,
  SERVER_URL,
  SERVER_PORT,
  JWT_SECRET
}

// Enum helper. Honestly not sure why I use enums but yeah
// https://stackoverflow.com/questions/43100718/typescript-enum-to-object-array
const StringIsNumber = (value: string | number) =>
  isNaN(Number(value)) === false;
function ToArray(enumme: typeof EnvironmentalVariables) {
  return Object.keys(enumme)
    .filter(StringIsNumber)
    .map(key => enumme[key]);
}

export const checkEnvironmentVariables = () => {
  for (const envVar of ToArray(EnvironmentalVariables)) {
    if (!process.env[envVar]) {
      throw new Error('Missing environment variable: ' + envVar);
    }
  }
};
