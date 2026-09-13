-- ESQUEMA OFICIAL UNICO DE ECOAMIGOS. PostgreSQL; solo para base vacia.
-- No migra, no borra y no incluye datos de negocio ni credenciales.
-- Repetir sobre una base existente falla y revierte la transaccion.
\set ON_ERROR_STOP on
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TYPE user_role AS ENUM ('admin', 'leader');
CREATE TYPE record_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  dependency VARCHAR(150) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  team_id INT REFERENCES teams(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE public.password_reset_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  token_hash VARCHAR(64) NOT NULL UNIQUE CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  CHECK (expires_at > created_at)
);
CREATE INDEX password_reset_tokens_user_id_idx ON public.password_reset_tokens(user_id);
CREATE TABLE periods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
-- F09: cero activos es valido; nunca mas de uno.
CREATE UNIQUE INDEX periods_one_active_uidx ON public.periods (is_active) WHERE is_active = true;
CREATE TABLE content_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('agua','energia','papel','residuos')),
  type VARCHAR(20) NOT NULL CHECK (type IN ('text','image','video','file')),
  description TEXT,
  youtube_url TEXT, -- columna historica, no usada por los controladores
  file_url TEXT,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft','published')),
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
-- LEGADO: estructura histórica conservada; la aplicación no consulta ni administra premios.
CREATE TABLE prizes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE points_catalog (
  id SERIAL PRIMARY KEY,
  source_code VARCHAR(50),
  group_name VARCHAR(100) NOT NULL,
  action_name VARCHAR(150) NOT NULL,
  action_level VARCHAR(100),
  points INTEGER NOT NULL DEFAULT 0,
  evidence_required TEXT, -- el CSV contiene descripciones, no booleanos
  max_frequency VARCHAR(50)
);
CREATE TABLE recycling_records (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  period_id INT REFERENCES periods(id) ON DELETE SET NULL,
  material_type VARCHAR(30) NOT NULL CHECK (material_type IN ('papel_carton','plastico','vidrio','metal','organico')),
  quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(20) NOT NULL DEFAULT 'kg',
  quality_level VARCHAR(10) NOT NULL CHECK (quality_level IN ('alta','media','baja')),
  criteria_count INT NOT NULL DEFAULT 0 CHECK (criteria_count >= 0),
  notes TEXT,
  evidence_url TEXT,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status record_status NOT NULL DEFAULT 'pending',
  review_notes TEXT,
  points_awarded INT DEFAULT 0,
  reviewed_by INT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  catalog_group_name VARCHAR(100),
  catalog_action_name VARCHAR(150),
  catalog_action_level VARCHAR(100)
);
-- LEGADO: no consultada por el backend; conservada hasta retirar dependencias.
CREATE TABLE winner_records (
  id SERIAL PRIMARY KEY,
  period_id INT NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  prize_id INT REFERENCES prizes(id) ON DELETE SET NULL,
  final_score INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(period_id, team_id)
);
-- Misma identidad normalizada que utiliza getCatalogPoints.
CREATE UNIQUE INDEX points_catalog_identity_uidx ON points_catalog (
  lower(trim(group_name)), lower(trim(action_name)),
  lower(trim(coalesce(action_level, '')))
);
COMMIT;
