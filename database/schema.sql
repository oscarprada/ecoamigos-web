-- =========================
-- TABLA DE USUARIOS
-- =========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'leader')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA DE EQUIPOS
-- =========================
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    leader_id INTEGER REFERENCES users(id)
);

-- =========================
-- TABLA DE PERIODOS
-- =========================
CREATE TABLE periods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true
);

-- =========================
-- TABLA DE RECICLAJE
-- =========================
CREATE TABLE recycling_records (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    user_id INTEGER REFERENCES users(id),
    material_type VARCHAR(50),
    quantity NUMERIC,
    unit VARCHAR(20),
    quality_checked BOOLEAN DEFAULT false,
    evidence_url TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA DE CONTENIDO
-- =========================
CREATE TABLE contents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    type VARCHAR(50),
    url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA DE PREMIOS
-- =========================
CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    period_id INTEGER REFERENCES periods(id)
);

-- =========================
-- DATOS INICIALES
-- =========================

-- Usuario admin
INSERT INTO users (email, password, role)
VALUES ('admin@ecoamigos.local', '$2b$10$hashedpassword', 'admin');

-- Equipos base
INSERT INTO teams (name) VALUES
('Administrativa'),
('Técnica'),
('Jurídica'),
('Contratos'),
('Farallones');

-- Periodo inicial
INSERT INTO periods (name, start_date, end_date, is_active)
VALUES ('Periodo Inicial', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true);
