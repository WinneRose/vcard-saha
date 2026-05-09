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
