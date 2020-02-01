--! Previous: sha1:bf2bff2e45f1e750958c4cf459fe66adedfb6c4f
--! Hash: sha1:7e47fa55182eaa93a6b00bb6702201607989bc46

-- Enter migration here
-- registerWithUsername

CREATE OR REPLACE FUNCTION app_public.register_user (username text, email text, PASSWORD text)
  RETURNS app_public.user_account
  AS $$
DECLARE
  account app_public.user_account;
BEGIN
  INSERT INTO app_public.user_account (username)
    VALUES (username)
  RETURNING
    * INTO account;
  INSERT INTO app_private.user_account_private (user_id, email, password_hash)
    VALUES (account.user_id, email, crypt(PASSWORD, gen_salt('bf')));
  RETURN account;
END;
$$
LANGUAGE PLPGSQL
STRICT
SECURITY DEFINER;

COMMENT ON FUNCTION app_public.register_user (text, text, text) IS 'Register`s a user account, with a username.';

GRANT EXECUTE ON FUNCTION app_public.register_user (text, text, text) TO app_anonymous;

-- end registerWithUsername
-- DROP TYPE IF EXISTS app_public.jwt_token;
-- CREATE TYPE app_public.jwt_token AS (
--   ROLE TEXT,
--   user_id uuid
-- );
-- current_person

CREATE OR REPLACE FUNCTION app_public.current_person ()
  RETURNS app_public.user_account
  AS $$
  SELECT
    *
  FROM
    app_public.user_account
  WHERE
    user_id = current_setting('jwt.claims.user_id')::UUID
$$
LANGUAGE sql
STABLE;

COMMENT ON FUNCTION app_public.current_person () IS 'Returns the user currently in the session.';

-- authenticate_by_email
CREATE OR REPLACE FUNCTION app_private.authenticate_by_email (email text, PASSWORD text)
  RETURNS app_public.user_account
  AS $$
DECLARE
  v_user app_public.user_account;
  v_user_private app_private.user_account_private;
BEGIN
  SELECT
    a.* INTO v_user_private
  FROM
    app_private.user_account_private AS a
  WHERE
    a.email ILIKE authenticate_by_email.email;
  IF v_user_private.password_hash = crypt(authenticate_by_email.password, v_user_private.password_hash) THEN
    SELECT
      b.* INTO v_user
    FROM
      app_public.user_account AS b
    WHERE
      b.user_id = v_user_private.user_id;
    RETURN v_user;
  ELSE
    RETURN NULL;
  END IF;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

COMMENT ON FUNCTION app_private.authenticate_by_email (text, text) IS 'Internal function to be called by postgraphile`s resolvers.';

--
-- authenticate_by_username

CREATE OR REPLACE FUNCTION app_private.authenticate_by_username (username text, PASSWORD text)
  RETURNS app_public.user_account
  AS $$
DECLARE
  v_user app_public.user_account;
  v_user_private app_private.user_account_private;
BEGIN
  SELECT
    a.* INTO v_user
  FROM
    app_public.user_account AS a
  WHERE
    a.username ILIKE authenticate_by_username.username;
  --
  SELECT
    b.* INTO v_user_private
  FROM
    app_private.user_account_private AS b
  WHERE
    b.user_id = v_user.user_id;
  --
  IF v_user_private.password_hash = crypt(PASSWORD, v_user_private.password_hash) THEN
    SELECT
      b.* INTO v_user
    FROM
      app_public.user_account AS b
    WHERE
      b.user_id = v_user_private.user_id;
    RETURN v_user;
  ELSE
    RETURN NULL;
  END IF;
END;
$$
LANGUAGE plpgsql
STRICT
SECURITY DEFINER;

COMMENT ON FUNCTION app_private.authenticate_by_username (text, text) IS 'Internal function to be called by postgraphile`s resolvers.';

--
