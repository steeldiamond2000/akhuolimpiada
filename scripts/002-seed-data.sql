-- =============================================
-- EcoFaol Talabalar - Initial Admin Data
-- =============================================
-- Parol: admin123 (bcrypt hash)
-- Ishlatishdan oldin parolni o'zgartiring!

INSERT INTO admins (username, password_hash, full_name)
VALUES (
    'admin',
    '$2a$10$rOvHPxfzO2.KQHQ9Q5sKxOe8YqKJ.F7mAKvK.CfKvj7k1EQX5PXHW',
    'Administrator'
) ON CONFLICT (username) DO NOTHING;

-- Namuna post (test uchun)
INSERT INTO posts (title, content, published, created_by)
VALUES (
    '"Yangi daraxt — yangi nafas" fakultet ekochempionati bo''lib o''tdi',
    '<p>Bugun, 13-noyabr <strong>Abu Rayhon Beruniy nomidagi Urganch davlat universiteti Tabiiy va qishloq xo''jaligi fanlari fakultetida "Yashil makon" umummilliy loyihasi</strong> doirasida "Yangi daraxt — yangi nafas" Respublika ekochempionatining fakultet bosqichi o''tkazildi.</p>
<p>Tadbir O''zbekiston Respublikasi Prezidentining "2030-yilgacha bo''lgan davrda aholining ekologik madaniyatini yuksaltirish konsepsiyasi" hamda Oliy ta''lim, fan va innovatsiyalar vazirligining 2025-yil 10-noyabrdagi xati ijrosi doirasida tashkil etildi.</p>',
    true,
    1
);

-- Namuna media
INSERT INTO post_media (post_id, media_type, url, sort_order)
VALUES 
    (1, 'image', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9mtf5HyOsm6Qt6uF2I5Pzh4tdji6qp.png', 0);
