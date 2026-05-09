# vCard Oluşturucu

Görsel bir vCard / kartvizit / bento profil sayfası oluşturma aracı. Next.js + Tailwind + Neon Postgres.

## Özellikler

- Teknofest kurumsal palet (lacivert + camgöbeği aksent), sade & elegant tasarım
- Görsel kart önizleme + bento layout profil sayfası
- Profil fotoğrafı + **CV PDF** yükleme; PDF site içinde inline viewer ile açılır
- E-posta, telefon, adres, kurum, ünvan, kısa bio
- Sosyal medya linkleri (LinkedIn, GitHub, Twitter/X, web) — her biri marka rengiyle aksent çizgili bento kartı
- `.vcf` indirme + QR kod + yazdırılabilir CV
- **Yayınla & Paylaş**: `/p/{slug}` URL'si, OG metadata ile sosyal medya önizlemesi
- `/edit/{slug}` ile yayınlayan tarayıcıdan düzenleme (localStorage'da `editToken`)

## Setup

### 1. Neon Postgres

1. [neon.tech](https://neon.tech) → free tier proje oluştur
2. Connection string'i kopyala (Dashboard → Connection Details → "Pooled connection" / "psql")
3. `.env.example`'ı `.env.local` olarak kopyala ve `DATABASE_URL` değerini doldur

İlk istek geldiğinde `profiles` tablosu otomatik (`CREATE TABLE IF NOT EXISTS`) oluşturulur. İsterseniz `sql/0001_init.sql` dosyasını manuel de çalıştırabilirsiniz.

### 2. Local geliştirme

```bash
npm install
npm run dev
# http://localhost:3000
```

### 3. Vercel deploy

1. [vercel.com/new](https://vercel.com/new) → GitHub bağla → repoyu seç
2. **Environment Variables**: `DATABASE_URL` ekle (Neon connection string)
3. **Deploy**

## Yapı

```
src/
  app/
    page.tsx                    # Form + önizleme + Yayınla flow
    p/[slug]/page.tsx           # Bento profil (server-rendered, OG metadata)
    edit/[slug]/page.tsx        # Yetkili düzenleme
    api/profiles/route.ts       # POST create
    api/profiles/[slug]/route.ts # GET read, PUT update
    print/page.tsx              # Yazdırılabilir CV (A4)
  components/
    bento/                      # Bento kartları (Hero, Bio, Contact, Social, QR)
    BentoProfile.tsx
    VCardForm, VCardPreview, ...
  lib/
    db.ts                       # Neon client + ensureSchema
    profiles.ts                 # CRUD
    saved-profiles.ts           # localStorage editToken yönetimi
    slug.ts, social.ts, vcard.ts, ...
  types/profile.ts
sql/0001_init.sql               # Şema referansı
```

## Düzenleme yetkisi

Profili oluşturan tarayıcı `editToken` değerini localStorage'a kaydeder. `PUT /api/profiles/[slug]` bu token'ı doğrular. Token kaybolursa profili düzenleme yetkisi de kaybolur (DB'de profil kalmaya devam eder).
