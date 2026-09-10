-- F09 para instalaciones que ya ejecutaron D01 antes de esta correccion.
-- Aplicar una sola vez. No ejecutar si schema.sql/D01 ya instalaron el indice.
-- No selecciona ganadores, no cambia filas y no modifica el catalogo.
\set ON_ERROR_STOP on
BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '5min';
LOCK TABLE public.periods IN SHARE ROW EXCLUSIVE MODE;
DO $f09$
BEGIN
  IF (SELECT count(*) FROM public.periods WHERE is_active = true) > 1 THEN
    RAISE EXCEPTION 'F09 abortada: varios periodos activos; requiere decision institucional, sin correccion automatica.';
  END IF;
END
$f09$;
CREATE UNIQUE INDEX periods_one_active_uidx ON public.periods (is_active) WHERE is_active = true;
COMMIT;
