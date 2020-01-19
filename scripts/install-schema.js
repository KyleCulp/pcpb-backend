const { Client } = require('pg');
const fs = require("fs");
require('dotenv').config();


async function main() {
	const connectionString = process.env.ROOT_DATABASE_DB;
	if (!connectionString) {
		throw new Error("ROOT_DATABASE_DB not set!");
	}
	const sqlFile = fs.readFileSync('./migrations/afterReset.sql').toString();
	const client = new Client({connectionString});

	client.connect();
	client.query(sqlFile, (err, result) => {
		if(err){
			console.log('error: ', err);
			process.exit(1);
		}
		console.log('Installation of schema complete.');
		process.exit(0);
	});
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
