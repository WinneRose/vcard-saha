# vCard Oluşturucu

Basit, görsel bir vCard / kartvizit / mini-CV oluşturma uygulaması. Next.js + Tailwind ile yazıldı, **veriler sadece tarayıcıda** (localStorage) saklanır.

## Özellikler

- LinkedIn tarzı görsel kart önizlemesi (gradient banner + avatar)
- Profil fotoğrafı yükleme (otomatik sıkıştırma)
- E-posta, telefon, adres, kurum, ünvan, kısa bio
- Sosyal medya linkleri (LinkedIn, GitHub, Twitter/X, web)
- **`.vcf` indirme** — telefon rehberine eklenebilir (vCard 3.0)
- **QR kod** — telefon kamerasıyla taranınca kişi olarak eklenir
- **PDF / CV** — `/print` sayfasında yazdır → "Save as PDF"

## Geliştirme

```bash
npm install
npm run dev
# http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Vercel'e Deploy

Repo Vercel'e bağlandığında otomatik olarak Next.js algılanır. `vercel.json` framework, build komutu ve güvenlik header'larını tanımlar. Adımlar:

1. [vercel.com/new](https://vercel.com/new) → GitHub hesabını bağla
2. `vcard-saha` reposunu seç
3. Branch olarak `claude/vcard-generator-app-v4kCT` (veya `main` merge sonrası)
4. **Deploy** — başka ayar gerekmez

Alternatif: `npm i -g vercel && vercel` (CLI ile) — komut interaktif olarak link/kuracak.

## Yapı

```
src/
  app/
    page.tsx         # Form + önizleme
    print/page.tsx   # Yazdırılabilir CV (A4)
    layout.tsx
    globals.css      # Tailwind + @media print
  components/        # VCardForm, VCardPreview, PhotoUpload, SocialLinks, QRCodeBlock, ActionButtons
  lib/
    vcard.ts         # vCard 3.0 stringleyici
    storage.ts       # localStorage adaptörü
    download.ts      # Dosya indirme yardımcıları
  types/profile.ts
```
