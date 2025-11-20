# 🚨 404 HATA ÇÖZÜM REHBERİ

## ✅ YAPTIĞIMIZ DEĞİŞİKLİK

`vite.config.ts` dosyasında `base` URL'i basitleştirdik:

```typescript
// Önce: base: '/CareWeb/'
// Şimdi: base: '/'
```

---

## 📋 ŞİMDİ NE YAPMANIZ GEREKİYOR?

### ADIM 1: Değişikliği Push Et

```bash
cd /Users/mac/Desktop/CareWeb/CareWeb
git add .
git commit -m "fix: adjust base URL for GitHub Pages"
git push origin main
```

### ADIM 2: GitHub Actions'ı İzle (2-3 dakika)

Tarayıcıda bu URL'e git:
```
https://github.com/yunus5112/CareWeb/actions
```

✅ Yeşil tik bekle

### ADIM 3: Siteyi Test Et

Tarayıcıda:
```
https://yunus5112.github.io/CareWeb/
```

---

## 🎯 SONUÇLAR:

### ✅ Senaryo A: Site Çalıştı!

**SORUN:** Base URL yanlıştı.

**ÇÖ ZÜM:** GitHub repo adınızı kontrol edin:
1. https://github.com/yunus5112 adresine gidin
2. Repo adını TAM OLARAK not edin (büyük/küçük harf önemli!)
3. vite.config.ts'de doğru base URL'i ayarlayın:

```typescript
// Repo adı: CareWeb (büyük C, büyük W)
base: process.env.NODE_ENV === 'production' ? '/CareWeb/' : '/'

// Repo adı: careweb (hepsi küçük)
base: process.env.NODE_ENV === 'production' ? '/careweb/' : '/'

// Repo adı: test-builder
base: process.env.NODE_ENV === 'production' ? '/test-builder/' : '/'
```

Doğru URL'i ayarladıktan sonra tekrar push et.

---

### ❌ Senaryo B: Hala 404

O zaman başka bir sorun var. Şunları kontrol et:

#### 1. GitHub Actions Başarılı mı?
```
https://github.com/yunus5112/CareWeb/actions
```
- Yeşil ✓ olmalı
- Kırmızı ✗ varsa build hatası var, logları oku

#### 2. GitHub Pages Ayarları Doğru mu?
```
https://github.com/yunus5112/CareWeb/settings/pages
```
Kontrol et:
- ✅ Source: "GitHub Actions" seçili mi?
- ✅ Yeşil banner: "Your site is live at..." var mı?

#### 3. Build Çalışıyor mu? (Local Test)
```bash
cd /Users/mac/Desktop/CareWeb/CareWeb
npm run build
ls -la dist/

# index.html var mı?
cat dist/index.html | head -20
```

---

## 🔍 DEBUG: Repo Adını Bulma

Eğer repo adından emin değilseniz:

### Yöntem 1: GitHub'da Kontrol
1. https://github.com/yunus5112 git
2. Repo listesinde adını gör
3. Repo'ya tıkla, URL'deki adı kopyala

### Yöntem 2: Git ile Kontrol
```bash
cd /Users/mac/Desktop/CareWeb/CareWeb
git remote -v

# Çıktı:
# origin  https://github.com/yunus5112/[REPO-ADI].git
#                                       ^^^^^^^^^^
#                                      Bu kısım önemli!
```

---

## 💡 ALTERN ATIF ÇÖZÜM: Ana Sayfa Olarak Yayınla

Eğer bu sorunlardan bıktıysanız:

### Seçenek 1: Ana GitHub Pages Sitesi
Repo adını `yunus5112.github.io` olarak değiştirin:
- URL: `https://yunus5112.github.io/`
- base: `'/'` (subdirectory yok)

### Seçenek 2: Custom Domain
```
https://github.com/yunus5112/CareWeb/settings/pages
→ Custom domain: mywebsite.com
→ base: '/' kullan
```

---

## 📞 YARDIM GEREKİYORSA

1. GitHub Actions loglarını kontrol et
2. Console'da hata var mı bak (F12)
3. Network tab'da hangi dosyaların yüklenmediğini gör

---

**Son güncelleme:** Şimdi
**Değişiklik:** base URL basitleştirildi
**Sonraki adım:** Push et ve test et

