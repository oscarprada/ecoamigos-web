-- REFERENCIA DOCUMENTAL para una base VACIA; no es una migracion.
-- Derivada de los controladores y formularios al 2026-09-07.
-- No ejecutada ni certificada contra una base PostgreSQL en esta revision.
-- No contiene credenciales, puntos inventados ni datos de produccion.
-- Deliberadamente sin IF NOT EXISTS en tablas: una base previa debe fallar.
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
  password TEXT, -- compatibilidad: createUser escribe ambos hashes
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  team_id INT REFERENCES teams(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE periods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
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
CREATE TABLE winner_records (
  id SERIAL PRIMARY KEY,
  period_id INT NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  prize_id INT REFERENCES prizes(id) ON DELETE SET NULL,
  final_score INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(period_id, team_id)
);
COMMIT;
