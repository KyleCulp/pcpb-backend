import { Request, Response, Application } from 'express';

import passport from 'passport';
import { Pool } from 'pg';

async function getUserByIdentifier(rootPgPool: Pool, identifier) {
    const {
        rows: [user]
    } = await rootPgPool.query(
        `
		select user_account.* from app.user_account
      	where user_account.user_id = $1
		`,
        [identifier]
    );

    // console.log(user);

    if (!user) return false; // This MUST be 'false', not 'null', due to how Passport works

    return user;
}

export const installPassport = async (app: Application) => {
    const rootPgPool: Pool = app.get('rootPgPool');

    passport.serializeUser<any, any>((user, done) => {
        done(null, user['user_id']);
    });

    passport.deserializeUser((identifier, done) => {
        /*
         * This is causing issues, where if you are logged in then a middleware cancels the operation
         */
        getUserByIdentifier(rootPgPool, identifier).then(e => done(e));
    });

    const passportInitializeMiddleware = passport.initialize();
    app.use(passportInitializeMiddleware);
    app.get('websocketMiddlewares').push(passportInitializeMiddleware);

    const passportSessionMiddleware = passport.session();
    app.use(passportSessionMiddleware);
    app.get('websocketMiddlewares').push(passportSessionMiddleware);

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};

export const getUserClaimsFromRequest = async (req: Request) => ({
    ...(req.user ? { ['user_id']: req.user['user_id'] } : null)
});
