# 🚀 GitHub Pages'e Deploy Rehberi

## 📋 Ön Hazırlık

### 1. GitHub Repository'si Oluştur

```bash
# Local projeyi initialize et
cd /Users/mac/Desktop/CareWeb/CareWeb
git init
git add .
git commit -m "Initial commit: Phase 1 refactoring completed"

# GitHub'da yeni repo oluştur: https://github.com/new
# Repo adı: CareWeb (veya istediğiniz ad)

# Remote ekle
git remote add origin https://github.com/[USERNAME]/CareWeb.git
git branch -M main
git push -u origin main
```

---

## 🌐 GitHub Pages Ayarları

### Adım 1: Repository Settings

1. GitHub'da repo'nuza gidin
2. **Settings** → **Pages** sekmesine gidin
3. **Source** olarak **"GitHub Actions"** seçin
4. Save

### Adım 2: Build ve Deploy

```bash
# Değişiklikleri push et
git add .
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

**GitHub Actions otomatik çalışacak!** 

- **Actions** sekmesinden deployment'i izleyebilirsiniz
- ~2-3 dakika sonra siteniz yayında olacak
- URL: `https://[USERNAME].github.io/CareWeb/`

---

## ⚙️ Önemli Konfigürasyonlar

### vite.config.ts

```typescript
base: process.env.NODE_ENV === 'production' ? '/CareWeb/' : '/'
```

**⚠️ DİKKAT:** Repo adınız farklıysa burası değişmeli!

- Repo adı: `my-builder` → `base: '/my-builder/'`
- Custom domain: `mydomain.com` → `base: '/'`

---

## 🔄 Güncelleme Workflow'u

```bash
# 1. Değişiklikleri yap
# ... kod değişiklikleri ...

# 2. Build test et (local)
npm run build
npm run preview

# 3. Git'e commit et
git add .
git commit -m "feat: new feature"
git push origin main

# 4. GitHub Actions otomatik deploy eder! 🎉
```

---

## 🐛 Sorun Giderme

### Sorun 1: 404 Hatası
**Çözüm:** `vite.config.ts` içinde `base` URL'ini kontrol et

### Sorun 2: Assets Yüklenmiyor
**Çözüm:** `base` URL'i yanlış ayarlanmış olabilir

### Sorun 3: Build Hatası
**Çözüm:** 
```bash
# Local'de test et
npm run build

# Hata varsa düzelt ve tekrar dene
```

### Sorun 4: GitHub Actions Çalışmıyor
**Çözüm:** 
- Settings → Actions → Allow all actions
- Settings → Pages → Source: GitHub Actions

---

## 📊 Deployment Durumu

Deployment durumunu kontrol etmek için:
- Repository → **Actions** sekmesi
- En son workflow run'a tıklayın
- Her adımı görebilirsiniz

---

## 🎨 Custom Domain (Opsiyonel)

Kendi domain'inizi kullanmak için:

1. **Settings → Pages → Custom domain**
2. Domain adınızı girin (örn: `builder.mydomain.com`)
3. DNS ayarlarınızda CNAME kaydı oluşturun:
   ```
   CNAME: builder.mydomain.com → [USERNAME].github.io
   ```
4. `vite.config.ts` içinde `base: '/'` olarak değiştirin

---

## 📈 Monitoring

### Analytics Eklemek İsterseniz:

**Google Analytics:**
```html
<!-- index.html içine -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

**Plausible (Privacy-friendly):**
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## ✅ Checklist

- [ ] GitHub repo oluşturuldu
- [ ] `.github/workflows/deploy.yml` eklendi
- [ ] `vite.config.ts` base URL ayarlandı
- [ ] Settings → Pages → Source: GitHub Actions
- [ ] İlk push yapıldı
- [ ] GitHub Actions başarıyla çalıştı
- [ ] Site erişilebilir: `https://[USERNAME].github.io/CareWeb/`

---

## 🔗 Faydalı Linkler

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**🎉 Deployment tamamlandığında siteye erişebilirsiniz!**

