-- Ejecutar psql -X -f database/import_points_catalog.sql DESDE LA RAIZ del repositorio.
-- Ruta relativa portable; solo importa el CSV suministrado, sin inventar grupos/puntos.
\set ON_ERROR_STOP on
BEGIN;
CREATE TEMP TABLE catalog_import (
  source_code VARCHAR(50),
  group_name VARCHAR(100) NOT NULL CHECK (length(trim(group_name)) > 0),
  action_name VARCHAR(150) NOT NULL CHECK (length(trim(action_name)) > 0),
  action_level VARCHAR(100),
  points INTEGER NOT NULL,
  evidence_required TEXT,
  max_frequency VARCHAR(50)
) ON COMMIT DROP;
\copy catalog_import FROM 'database/points_catalog_clean.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')

-- Serializa importaciones concurrentes. Nunca borra o actualiza filas existentes.
LOCK TABLE points_catalog IN SHARE ROW EXCLUSIVE MODE;
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM catalog_import
    GROUP BY lower(trim(group_name)), lower(trim(action_name)), lower(trim(coalesce(action_level, '')))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'CSV con identidades duplicadas. Revisar el archivo; no se importo ninguna fila.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM points_catalog
    GROUP BY lower(trim(group_name)), lower(trim(action_name)), lower(trim(coalesce(action_level, '')))
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Catalogo existente con duplicados. Requiere revision manual, sin deduplicacion destructiva.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM catalog_import i JOIN points_catalog c
      ON lower(trim(c.group_name)) = lower(trim(i.group_name))
     AND lower(trim(c.action_name)) = lower(trim(i.action_name))
     AND lower(trim(coalesce(c.action_level, ''))) = lower(trim(coalesce(i.action_level, '')))
    WHERE ROW(c.source_code,c.group_name,c.action_name,c.action_level,c.points,c.evidence_required,c.max_frequency)
      IS DISTINCT FROM ROW(i.source_code,i.group_name,i.action_name,i.action_level,i.points,i.evidence_required,i.max_frequency)
  ) THEN
    RAISE EXCEPTION 'Hay valores distintos para una identidad existente. No se sobrescriben puntos ni metadatos.';
  END IF;
END $$;
INSERT INTO points_catalog (source_code,group_name,action_name,action_level,points,evidence_required,max_frequency)
SELECT i.source_code,i.group_name,i.action_name,i.action_level,i.points,i.evidence_required,i.max_frequency
FROM catalog_import i
WHERE NOT EXISTS (
  SELECT 1 FROM points_catalog c
  WHERE lower(trim(c.group_name)) = lower(trim(i.group_name))
    AND lower(trim(c.action_name)) = lower(trim(i.action_name))
    AND lower(trim(coalesce(c.action_level, ''))) = lower(trim(coalesce(i.action_level, '')))
);
COMMIT;
\echo 'Importacion terminada. El CSV historico NO aporta el grupo Dependencias institucionales.'
