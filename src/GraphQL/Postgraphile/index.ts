import { PostGraphileOptions } from "postgraphile";

require("dotenv").config();

const schemas = ["app_public", "parts"];
// const pluginHook = makePluginHook([PgPubSub].filter(_ => _));

const {
	PG_MASTER_ADMIN_USERNAME,
	PG_MASTER_ADMIN_PASSWORD,
	PG_MASTER_HOST,
	PG_MASTER_PORT,
	PG_MASTER_NAME,
} = process.env;

const ownerConnectionString = `postgres://${PG_MASTER_ADMIN_USERNAME}:${PG_MASTER_ADMIN_PASSWORD}@${PG_MASTER_HOST}:${PG_MASTER_PORT}/${PG_MASTER_NAME}`;

export const postgraphileOptionsDevelopment: PostGraphileOptions = {
	watchPg: true,
	retryOnInitFail: false,
	ownerConnectionString: ownerConnectionString,
	subscriptions: true,
	live: true, // Enables live-queries
	pgDefaultRole: "app_anonymous",
	dynamicJson: true,
	setofFunctionsContainNulls: false, // Set to true if any setof psql functions return potential null
	classicIds: false,
	disableDefaultMutations: false, // Disables mutations for fields by default
	ignoreRBAC: false,
	ignoreIndexes: false,
	// includeExtensionResources: , // Include psql extension's tables to the graph
	showErrorStack: true,
	extendedErrors: ["hint", "detail", "errcode"],
	// handleErrors: true, // no idea what input it needs?
	// prependPlugins: , // No need to load plugins before postgraphile
	// skipPlugins: , // Skip core plugins
	// readCache: , // production only
	// writeCache: , // production only
	// exportJsonSchemaPath: , // export schema file
	// exportGqlSchemaPath: , // export schema file
	// sortExport: false,
	graphqlRoute: "/postgraphile",
	graphiqlRoute: "/postgraphiql",
	graphiql: true,
	enhanceGraphiql: true,
	enableCors: true, // Unknown what this does
	bodySizeLimit: "200kB", // Default is '100kB'
	enableQueryBatching: true, // Experimental, allows for multiple queries in one request
	// jwtSecret: 'pleaseacceptmyjwt',
	// jwtVerifyOptions: ,// https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
	// jwtRole: ["role"], // The role on the jwt, ['role'] is default 
	// jwtPgTypeIdentifier: "app.jwt_token", // The JWT Type in the DB, schema.table_name
	legacyJsonUuid: false,
	disableQueryLog: true, 
	allowExplain: true,
	// additionalGraphQLContextFromRequest: , // Hmm
	simpleCollections: "only", // disable relay stuff, we're using Apollo
	// queryCacheMaxSize: 0, // Query cache size, default is 50MB, 0 is infinite but broken lol
	/*
     * Plugins to enhance the GraphQL schema, see:
     *   https://www.graphile.org/postgraphile/extending/
     */
    
  
	graphileBuildOptions: {
		/*
			* Any properties here are merged into the settings passed to each Graphile
			* Engine plugin - useful for configuring how the plugins operate.
			*/

		/*
			* We install our own watch fixtures manually because we run PostGraphile
			* with non-database-owner privileges, so we don't need to be warned that
			* they were not installed
			*/
		pgSkipInstallingWatchFixtures: true,
	},
	// async pgSettings(req: IncomingMessage) {
	// 	const claims = await getUserClaimsFromRequest(req);
	// 	return {
	// 		// Everyone uses the "visitor" role currently
	// 		role: process.env.DATABASE_VISITOR,
	
	// 		// If there are any claims, then add them into the session.
	// 		...Object.entries(claims).reduce((memo, [key, value]) => {
	// 			if (!key.match(/^[a-z][a-z0-9A-Z-_]+$/)) {
	// 				throw new Error("Invalid claim key.");
	// 			}
	
	// 			/*
	// 			* Note, though this says "jwt" it's not actually anything to do with
	// 			* JWTs, we just know it's a safe namespace to use, and it means you
	// 			* can use JWTs too, if you like, and they'll use the same settings
	// 			* names reducing the amount of code you need to write.
	// 			*/
	// 			memo[`jwt.claims.${key}`] = value;
	// 			return memo;
	// 		}, {}),
	// 	};
	// }

};

// Haven't made it prod-ready yet
// Overwrite dev settings with prod settings
export const postgraphileOptionsProduction: PostGraphileOptions = {
	...postgraphileOptionsDevelopment,

};

const postgraphileOptions = process.env.NODE_ENV === 'development' ? postgraphileOptionsDevelopment : postgraphileOptionsProduction;

export const PostgraphileInstance = {
	schemas,
	postgraphileOptions
};