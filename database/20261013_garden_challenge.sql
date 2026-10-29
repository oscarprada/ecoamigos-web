\set ON_ERROR_STOP on
BEGIN;
-- Additive migration; repeat execution fails and rolls back without touching data.
\ir garden_tables.sql
COMMIT;
