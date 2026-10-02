# AstroGuidance — Uygulama Maddeleri

PRD'den türetilen sıra. Site 1. maddeden başlanarak kurulur.

## 1. Proje iskeleti ve görsel kimlik
- Next.js (App Router) + TypeScript + Tailwind CSS
- Göksel, mobil uyumlu layout, tipografi ve renk paleti
- Ana navigasyon ve ortak sayfa kabuğu

## 2. Açılış sayfası (ürün vizyonu)
- AstroGuidance vaadi, ücretsiz/ücretli ayrımı
- Doğum haritası oluşturmaya götüren CTA
- Freemium değer önerisi (burç, yükselen, ay, kısa analiz)

## 3. Doğum formu (veri toplama)
- Ad, doğum tarihi, doğum saati, doğum yeri
- Şehir araması (otomatik tamamlama)
- Hassas saat seçici ve form doğrulama

## 4. Koordinat ve zaman dönüşümü
- Şehir → enlem / boylam
- Yerel doğum saati → UTC
- Zaman dilimi hesabı

## 5. Natal harita motoru
- Güneş, Ay, Yükselen
- Gezegen konumları
- 12 ev yerleşimi
- Yapılandırılmış JSON çıktısı

## 6. Harita görselleştirme ve sonuç ekranı
- Natal tekerlek
- Gezegen / ev tablosu
- Element dengesi

## 7. Ücretsiz temel analiz
- Karakter ve mizaç özeti (150–200 kelime)
- Baskın elementler ve güçlü yönler
- Burç, Ay burcu, Yükselen tespiti

## 8. Ücretli derin raporlar (kilitli önizleme)
- İlişki & aşk (7. ev)
- Kariyer, para & yaşam amacı (10. ev)
- 6 aylık şans / transit takvimi
- Astro-AI soru hakkı

## 9. Kayıt, ödeme ve paylaşım (sonraki sprint)
- Supabase auth + harita geçmişi
- PayTR / Iyzico
- Paylaşılabilir özet kartı ve PDF
