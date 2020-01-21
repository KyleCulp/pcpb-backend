BEGIN;
create role app_postgraphile login password ':POSTGRAPHILE_PASSWORD';
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

create role app_anonymous;
create role app_person;

grant app_anonymous to app_postgraphile;
grant app_person to app_postgraphile;

COMMIT;
