-- Diagnostico exclusivamente de lectura; no migra ni expone hashes/datos personales.
\set ON_ERROR_STOP on
BEGIN READ ONLY;
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('users','teams','periods','content_items','contents',
                    'recycling_records','points_catalog','prizes','rewards','winner_records')
ORDER BY table_name, ordinal_position;
SELECT conrelid::regclass AS table_name, conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint WHERE connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, conname;
SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = 'public'
ORDER BY tablename, indexname;
COMMIT;
