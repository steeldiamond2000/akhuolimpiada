-- Boshlang'ich ma'lumotlar

-- Fanlarni qo'shish
INSERT INTO subjects (name) VALUES 
    ('Dasturlash'),
    ('Fizika'),
    ('Suniy intellekt'),
    ('Matematika')
ON CONFLICT (name) DO NOTHING;

-- Admin foydalanuvchi (parol: Admin123)
INSERT INTO users (fio, viloyat, tuman, maktab, sinf, telefon, login, password_hash, is_admin)
VALUES (
    'Admin User',
    'Toshkent',
    'Chilonzor',
    'Admin',
    '-',
    '+998901234567',
    'admin',
    '$2b$10$rQZ8K1Y5GhXqZP5X5X5X5O5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X',
    TRUE
)
ON CONFLICT (login) DO NOTHING;

-- Olimpiada sozlamalarini qo'shish (24 soatdan keyin boshlanadi)
INSERT INTO olympiad_settings (start_time, duration_minutes, is_active)
VALUES (
    NOW() + INTERVAL '24 hours',
    120,
    TRUE
);
