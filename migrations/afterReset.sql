BEGIN;


-- Create role if not exist
DO
$do$
BEGIN
  IF NOT EXISTS (
    SELECT
    FROM pg_catalog.pg_roles
    WHERE  rolname = 'devadmin') THEN

    CREATE ROLE devadmin SUPERUSER LOGIN PASSWORD ':DEVADMIN_PASSWORD';
  END IF;
END
$do$;
DO
$do$
BEGIN
  IF NOT EXISTS (
    SELECT
    FROM pg_catalog.pg_roles
    WHERE  rolname = 'app_postgraphile') THEN

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

create schema app_public;
create schema app_private;
create schema parts;

DO
$do$
BEGIN
  IF NOT EXISTS (
    SELECT
    FROM pg_catalog.pg_roles
    WHERE  rolname = 'app_anonymous') THEN

    CREATE ROLE app_anonymous;
  END IF;
END
$do$;

DO
$do$
BEGIN
  IF NOT EXISTS (
    SELECT
    FROM pg_catalog.pg_roles
    WHERE  rolname = 'app_person') THEN

    CREATE ROLE app_person;
  END IF;
END
$do$;

-- create role app_anonymous;
-- create role app_person;

grant app_anonymous to app_postgraphile;
grant app_person to app_postgraphile;

COMMIT;
