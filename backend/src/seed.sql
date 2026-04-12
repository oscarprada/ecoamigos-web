-- Ejecutar después de schema.sql
INSERT INTO teams (name, dependency) VALUES
('Administrativa', 'Área administrativa'),
('Técnica', 'Dependencia técnica'),
('Jurídica', 'Dependencia jurídica'),
('Contratos', 'Dependencia de contratos'),
('Farallones', 'PNN Farallones')
ON CONFLICT DO NOTHING;

INSERT INTO periods (name, start_date, end_date, is_active)
VALUES ('Campaña Abril 2026', '2026-04-01', '2026-04-30', true)
ON CONFLICT DO NOTHING;

INSERT INTO prizes (name, description, is_active) VALUES
('Camisetas de la campaña', 'Premio para el equipo ganador del periodo', true),
('Entradas al zoológico', 'Incentivo ecológico para el equipo destacado', true)
ON CONFLICT DO NOTHING;

-- Contraseña por defecto: Admin123*
INSERT INTO users (name, email, password_hash, role)
VALUES ('Administrador Ecoamigos', 'admin@ecoamigos.local', '$2b$10$KAAI5vms8qJ7qYB0l1Xz3O/oHOFM8JrIoYNewc0hXtOD87mpy4VbG', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO content_items (title, type, description, youtube_url, status, created_by)
SELECT 'Bienvenida a Ecoamigos', 'video', 'Video principal de la campaña', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'published', u.id
FROM users u WHERE u.email = 'admin@ecoamigos.local'
ON CONFLICT DO NOTHING;

INSERT INTO content_items (title, type, description, status, created_by)
SELECT 'Separa residuos correctamente', 'tip', 'Lava, seca y separa los residuos antes de entregarlos.', 'published', u.id
FROM users u WHERE u.email = 'admin@ecoamigos.local'
ON CONFLICT DO NOTHING;
