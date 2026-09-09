-- Entrada de compatibilidad para psql; la unica definicion esta en database/schema.sql.
-- Solo base vacia; NO es una migracion de una base existente.
\set ON_ERROR_STOP on
\ir ../database/schema.sql
