-- Al-Xorazmiy Olimpiadasi Database Schema
-- PostgreSQL

-- Fanlar jadvali
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foydalanuvchilar jadvali
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE,
    fio VARCHAR(255) NOT NULL,
    viloyat VARCHAR(100) NOT NULL,
    tuman VARCHAR(100) NOT NULL,
    maktab VARCHAR(200) NOT NULL,
    sinf VARCHAR(50) NOT NULL,
    telefon VARCHAR(20) NOT NULL,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Savollar jadvali
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    score INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Olimpiada sozlamalari
CREATE TABLE IF NOT EXISTS olympiad_settings (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foydalanuvchi javoblari
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option CHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id)
);

-- Natijalar jadvali
CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, subject_id)
);

-- Indekslar
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);
CREATE INDEX IF NOT EXISTS idx_questions_subject_id ON questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON answers(user_id);
CREATE INDEX IF NOT EXISTS idx_results_user_id ON results(user_id);
