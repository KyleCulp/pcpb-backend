BEGIN;

-- Create role if not exist
DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT
    FROM
      pg_catalog.pg_roles
    WHERE
      rolname = 'devadmin') THEN
  CREATE ROLE devadmin SUPERUSER LOGIN PASSWORD ':DEVADMIN_PASSWORD';
END IF;
END
$do$;

DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT
    FROM
      pg_catalog.pg_roles
    WHERE
      rolname = 'app_postgraphile') THEN
  CREATE ROLE app_postgraphile LOGIN PASSWORD ':POSTGRAPHILE_PASSWORD';
END IF;
END
$do$;

-- create role app_postgraphile login password ':POSTGRAPHILE_PASSWORD';
GRANT CONNECT ON DATABASE :DATABASE_NAME TO :DATABASE_OWNER;

GRANT CONNECT ON DATABASE :DATABASE_NAME TO :DATABASE_AUTHENTICATOR;

GRANT ALL ON DATABASE :DATABASE_NAME TO :DATABASE_OWNER;

-- Some extensions require superuser privileges, so we create them before migration time.
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- alter default privileges revoke execute on functions from public;
CREATE SCHEMA app_public;

CREATE SCHEMA app_private;

CREATE SCHEMA parts;

DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT
    FROM
      pg_catalog.pg_roles
    WHERE
      rolname = 'app_anonymous') THEN
  CREATE ROLE app_anonymous;
END IF;
END
$do$;

DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT
    FROM
      pg_catalog.pg_roles
    WHERE
      rolname = 'app_person') THEN
  CREATE ROLE app_person;
END IF;
END
$do$;

GRANT app_anonymous TO app_postgraphile;

GRANT app_person TO app_postgraphile;

GRANT usage ON SCHEMA app_public TO app_anonymous, app_person, app_postgraphile;

GRANT usage ON SCHEMA parts TO app_anonymous, app_person, app_postgraphile;

COMMIT;

