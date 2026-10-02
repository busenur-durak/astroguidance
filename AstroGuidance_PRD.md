# Ürün Gereksinim Dokümanı (PRD): AstroGuidance

**Proje Durumu:** Taslak / MVP Planlama  
**Tarih:** Eylül 2026  
**Hedef Kitle:** Astrolojiye ilgi duyan, kişiselleştirilmiş rehberlik arayan bireysel kullanıcılar  

---

## 1. Ürün Özeti ve Vizyon

**AstroGuidance**, kullanıcıların doğum tarihi, doğum saati ve doğum yeri bilgilerini girerek dakikalar içinde natal (doğum) haritalarını hesaplayabildikleri; gelişmiş yapay zeka (LLM) desteğiyle kariyer, aşk/ilişki dinamikleri ve dönemsel şans analizlerini anlaşılır bir dille alabildikleri modern bir web platformudur.

### Temel Hedefler:
- Teknik astrolojik sembolleri ve karmaşık grafikleri herkesin anlayabileceği gündelik ve rehber niteliğinde içgörülere dönüştürmek.
- Düşük operasyonel maliyetle (açık kaynak kütüphaneler + hafif LLM modelleri) karlı ve sürdürülebilir bir mikro SaaS / freemium modeli oluşturmak.
- Yüksek kullanıcı deneyimi ve mobil uyumlu sade bir arayüzle viral paylaşılabilirliği artırmak.

---

## 2. Kullanıcı Akışı ve Çalışma Mantığı

Sistem 4 temel basamaktan oluşan bir veri boru hattı (pipeline) üzerinde çalışır:

1. **Veri Toplama (Frontend):**  
   Kullanıcı adı, doğum tarihi (gün/ay/yıl), net doğum saati (saat:dakika) ve doğum yerini (şehir/ülke) form üzerinden girer.
2. **Koordinat & Zaman Dönüşümü:**  
   Seçilen şehir, arka planda coğrafi koordinatlara (enlem ve boylam) ve doğum anındaki evrensel zaman dilimine (UTC) dönüştürülür.
3. **Astrolojik Hesaplama Motoru (Backend Engine):**  
   Swiss Ephemeris tabanlı kütüphaneler o koordinat ve zaman için Güneş, Ay, Yükselen burç (Ascendant) ve 12 astrolojik evin derecelerini çıkarıp yapılandırılmış bir JSON formatına dönüştürür.
4. **Yapay Zeka Yorumlama Katmanı (LLM Layer):**  
   Elde edilen teknik harita verisi, önceden optimize edilmiş bir sistem prompt'u eşliğinde yapay zeka modeline gönderilir; kullanıcıya özel samimi, akıcı ve aksiyon odaklı bir yorum metni üretilir.

---

## 3. Özellikler ve Kapsam (MVP)

| Modül | Özellik | Açıklama |
|---|---|---|
| **Kullanıcı Girişi** | Akıllı Lokasyon & Doğum Formu | Şehir seçimi için otomatik tamamlama (GeoNames API / OpenStreetMap), hassas saat seçici. |
| **Harita Motoru** | Temel Göstergeler & 12 Ev | Güneş, Ay, Yükselen burçlar, gezegen konumları ve 1-12. ev burç yerleşimlerinin listesi. |
| **Temel Analiz (Ücretsiz)** | Karakter & Element Dengesi | Kullanıcının genel mizacı, güçlü yönleri ve baskın elementleri hakkında 1-2 paragraflık genel özet. |
| **Derin Analiz (Ücretli)** | İlişki & Kariyer Dinamikleri | 7. ev (ilişkiler/evlilik) ve 10. ev (kariyer/hedef) yerleşimlerine dayalı özel tavsiyeler. |
| **Zamanlama (Ücretli)** | Şans & Dikkat Dönemleri | Güncel transitler veya dönemsel etkiler üzerinden şanslı ve dikkat edilmesi gereken dönem takvimi. |
| **Kaydetme & Paylaşım** | Harita Özeti Kartı | Sosyal medyada paylaşılabilir görsel harita özeti ve PDF rapor indirme seçeneği. |

---

## 4. Teknik Mimari ve Teknoloji Yığını

* **Frontend:** Next.js (React), Tailwind CSS  
  * *Avantajı:* Hızlı açılış, mükemmel mobil uyum, SEO dostu yapısı ve kolay Vercel dağıtımı.
* **Backend & Veritabanı:** Supabase (PostgreSQL + Auth)  
  * *Avantajı:* Kullanıcı kimlik doğrulama, harita geçmişini kaydetme ve API güvenliği için sıfır sunucu kurulumu gerektiren hazır altyapı.
* **Astrolojik Hesaplama:** Python (`flatlib` veya `pyswisseph`)  
  * *Avantajı:* Lisans veya API ücreti ödemeden tam hassasiyetli ev ve gezegen hesabı. Mikroservis (FastAPI) olarak konuşlandırılabilir.
* **Yapay Zeka Servisi:** OpenAI API (`gpt-4o-mini`) veya Google Gemini Flash API  
  * *Avantajı:* Sorgu başına $0.005 gibi ihmal edilebilir maliyetle yüksek edebi kalite ve tutarlı JSON/metin çıktısı.
* **Ödeme Altyapısı:** PayTR / Iyzico (Türkiye odağı) veya Stripe / Lemon Squeezy (Global odak).

---

## 5. Gelir Modeli ve Fiyatlandırma Stratejisi

Girişimin ilk aşamasında güven inşa etmek ve kullanıcı kazanımı sağlamak adına **Freemium** yaklaşımı benimsenir:

### Ücretsiz Katman (Freemium Hook)
- Burç, Yükselen ve Ay burcu tespiti
- 12 evin hangi burçlara denk geldiğini gösteren tablo
- Kısa genel karakter analizi (150-200 kelime)

### Mikro-Ödeme Raporları (Tek Seferlik Satın Alım)
- **Kişisel İlişki & Aşk Raporu:** 49 TL – 79 TL  
  *Partner uyumu, ilişki tuzakları, bağlanma stili analizi.*
- **Kariyer, Para & Yaşam Amacı Raporu:** 49 TL – 79 TL  
  *Mesleki yetenekler, finansal göstergeler, kariyer tavanı analizi.*
- **Gelecek Dönem Şans & Transit Takvimi (6 Aylık):** 89 TL – 119 TL  
  *Kritik tarihler, yeni başlangıçlar için uygun dönemler.*
- **Astro-AI Soru Hakkı:** 39 TL (Harita üzerinden spesifik 3 soru yanıtlama).

---

## 6. Geliştirme Yol Haritası (Roadmap)

1. **Sprint 1 - Çekirdek Hesaplama Motoru:** Python ile doğum verilerini alıp gezegen ve ev derecelerini JSON veren fonksiyonun test edilmesi.
2. **Sprint 2 - Prompt Mühendisliği:** Astrolojik veriyi kaliteli bir ilişki/kariyer yorumuna dönüştüren LLM sistem prompt'larının optimize edilmesi.
3. **Sprint 3 - UI/UX & Form Geliştirme:** Next.js ile responsive giriş formu, harita görselleştirme ekranı ve kilitli içerik önizlemelerinin kodlanması.
4. **Sprint 4 - Ödeme & Webhook Entegrasyonu:** Ödeme sağlayıcısının entegrasyonu, ödeme onaylandığında kilitli içeriğin açılması/raporun oluşturulması.
5. **Sprint 5 - Canlıya Alma & Test:** Vercel üzerinde canlıya çıkış, 30 kişilik kapalı beta testi ve metin kalitesi/dönüşüm oranı incelemesi.
