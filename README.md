# Al-Xorazmiy Olimpiadasi - Online Test Platformasi

Al-Xorazmiy nomidagi Urganch Davlat Universiteti tomonidan tashkil etilgan olimpiada uchun online test platformasi.

## Xususiyatlar

- **Landing Page**: Universitet haqida ma'lumot, countdown timer, video section
- **Telegram Bot**: Foydalanuvchilarni ro'yxatdan o'tkazish
- **User Dashboard**: Test topshirish va natijalarni ko'rish
- **Admin Panel**: Fanlar, savollar, sozlamalar va natijalarni boshqarish
- **JWT Authentication**: Xavfsiz sessiya boshqaruvi

## Texnologiyalar

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Bot**: Telegram Bot API

## O'rnatish

### 1. Dependencies o'rnatish

```bash
npm install
```

### 2. Environment Variables

`.env.local` faylini yarating:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/olimpiada

# JWT Secret (random string)
JWT_SECRET=your-super-secret-key-here-change-in-production

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

PostgreSQL da yangi database yarating:

```sql
CREATE DATABASE olimpiada;
```

SQL skriptlarini ishga tushiring:

```bash
# pgAdmin4 orqali yoki psql da
psql -d olimpiada -f scripts/001-create-tables.sql
psql -d olimpiada -f scripts/002-seed-data.sql
```

### 4. Telegram Bot Setup

1. @BotFather da yangi bot yarating
2. Bot tokenini oling
3. TELEGRAM_BOT_TOKEN environment variable ga qo'shing
4. Webhook o'rnating:

```bash
npx ts-node scripts/telegram-bot-setup.ts
```

### 5. Development Server

```bash
npm run dev
```

## Foydalanish

### Admin Panel

Default admin login:
- Login: `admin`
- Parol: `Admin123`

Admin panelda:
1. Fanlar qo'shing
2. Savollar kiriting
3. Olimpiada vaqtini belgilang

### Telegram Bot

1. Botga /start buyrug'ini yuboring
2. "Qatnashish" tugmasini bosing
3. Fan tanlang
4. Ma'lumotlaringizni kiriting
5. Login va parol oling

### Test Topshirish

1. Platformaga kiring
2. Olimpiada boshlanishini kuting
3. "Olimpiadani boshlash" tugmasini bosing
4. Savollarga javob bering
5. "Yuborish" tugmasini bosing

## Loyiha Strukturasi

```
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   ├── subjects/       # Fanlar CRUD
│   │   ├── questions/      # Savollar CRUD
│   │   ├── olympiad/       # Olimpiada sozlamalari
│   │   ├── test/           # Test topshirish
│   │   ├── admin/          # Admin endpoints
│   │   └── telegram/       # Telegram webhook
│   ├── admin/              # Admin panel
│   ├── dashboard/          # User dashboard
│   ├── login/              # Login sahifasi
│   └── about/              # Biz haqimizda
├── components/
│   ├── admin/              # Admin componentlar
│   ├── auth/               # Auth componentlar
│   ├── dashboard/          # Dashboard componentlar
│   ├── landing/            # Landing page componentlar
│   ├── test/               # Test componentlar
│   └── ui/                 # shadcn/ui componentlar
├── lib/
│   ├── db.ts               # Database connection
│   ├── auth.ts             # Authentication helpers
│   ├── types.ts            # TypeScript types
│   ├── telegram-bot.ts     # Telegram bot helpers
│   └── utils.ts            # Utility functions
└── scripts/
    ├── 001-create-tables.sql   # Database schema
    ├── 002-seed-data.sql       # Initial data
    └── telegram-bot-setup.ts   # Bot webhook setup
```

## Xavfsizlik

- Parollar bcrypt bilan hash qilingan
- JWT token 24 soatda expire bo'ladi
- HTTP-only cookies ishlatiladi
- CORS himoyasi mavjud
- SQL injection oldini olingan

## Production Deployment

1. PostgreSQL database yarating (Neon, Supabase, etc.)
2. Environment variables o'rnating
3. Vercel ga deploy qiling
4. Telegram webhook yangilang

## License

MIT
