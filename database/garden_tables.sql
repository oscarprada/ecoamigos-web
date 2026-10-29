-- Incremental migration definition; keep equivalent to database/schema.sql.
CREATE TABLE garden_crops (
  id SERIAL PRIMARY KEY,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  bed VARCHAR(150) NOT NULL CHECK (length(trim(bed)) > 0),
  vegetables TEXT[] NOT NULL CHECK (cardinality(vegetables) > 0 AND vegetables <@ ARRAY['cebolla larga','tomate','lechuga','cilantro','pimentón','ají']::text[]),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE garden_evidence (
  id SERIAL PRIMARY KEY,
  crop_id INT NOT NULL REFERENCES garden_crops(id) ON DELETE RESTRICT,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  period_id INT NOT NULL REFERENCES periods(id) ON DELETE RESTRICT,
  stage TEXT NOT NULL CHECK (stage IN ('seguimiento','crecimiento','cosecha')),
  record_date DATE NOT NULL,
  story TEXT NOT NULL,
  evidence_url TEXT NOT NULL,
  status record_status NOT NULL DEFAULT 'pending',
  review_notes TEXT,
  reviewed_by INT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  points_awarded INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (points_awarded = 0 OR (status = 'approved' AND ((stage = 'crecimiento' AND points_awarded = 50) OR (stage = 'cosecha' AND points_awarded = 100))))
);
-- Also prevents duplicate rewards if two different evidence requests race.
CREATE UNIQUE INDEX garden_reward_once ON garden_evidence(crop_id, stage) WHERE points_awarded > 0;
CREATE INDEX garden_evidence_crop_idx ON garden_evidence(crop_id, created_at);
