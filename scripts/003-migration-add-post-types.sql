-- =============================================
-- Migration: Yangi ustunlar qo'shish
-- Bu skriptni faqat mavjud bazaga yangi ustunlar qo'shish uchun ishlating
-- =============================================

-- post_type ustunini qo'shish (agar yo'q bo'lsa)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'posts' AND column_name = 'post_type') THEN
        ALTER TABLE posts ADD COLUMN post_type VARCHAR(20) DEFAULT 'post';
    END IF;
END $$;

-- pinned ustunini qo'shish (agar yo'q bo'lsa)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'posts' AND column_name = 'pinned') THEN
        ALTER TABLE posts ADD COLUMN pinned BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Yangi indekslarni qo'shish
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON posts(pinned);

-- Mavjud postlarni yangilash (agar kerak bo'lsa)
UPDATE posts SET post_type = 'post' WHERE post_type IS NULL;
UPDATE posts SET pinned = false WHERE pinned IS NULL;
