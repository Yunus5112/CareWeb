# 🚀 Test Builder - Drag & Drop Page Builder

Modern, kullanıcı dostu bir drag & drop page builder uygulaması. React, TypeScript, Tailwind CSS ve Vite ile geliştirilmiştir.

## ✨ Özellikler

### 🎨 Temel Özellikler
- **Drag & Drop Interface** - Sidebar'dan element sürükleyip canvas'a bırakma
- **Canlı Önizleme** - Değişiklikleri gerçek zamanlı görüntüleme
- **Element Yönetimi** - Header, Footer, Card, Text, Slider, Container componentleri
- **Özellik Paneli** - Seçili elementin özelliklerini düzenleme
- **JSON Export/Import** - Projenizi JSON formatında kaydetme ve yükleme

### 🔧 Gelişmiş Özellikler
- **Responsive Design** - Desktop, Tablet, Mobile görünüm modları
- **Grid System** - Snap-to-grid özelliği ile hassas yerleştirme
- **Selection & Transform** - Element seçme, taşıma ve boyutlandırma
- **Keyboard Shortcuts** - Hızlı erişim için klavye kısayolları
- **Z-Index Control** - Element katman yönetimi

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Kurulum

```bash
# Projeyi klonlayın
git clone [repository-url]
cd CareWeb

# Bağımlılıkları yükleyin
npm install

# Development server'ı başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine gidin.

## 📁 Proje Yapısı

```
src/
├── components/          # React componentleri
│   ├── elements/       # Element tipleri (Header, Card, vs.)
│   ├── Canvas.tsx      # Ana canvas alanı
│   ├── Sidebar.tsx     # Element listesi
│   ├── Toolbar.tsx     # Üst araç çubuğu
│   ├── PropertiesPanel.tsx  # Özellik düzenleme paneli
│   └── PageBuilder.tsx # Ana layout
├── store/              # State management (Context API)
├── types/              # TypeScript type definitions
├── utils/              # Yardımcı fonksiyonlar
├── hooks/              # Custom React hooks
└── App.tsx             # Ana uygulama
```

## 🎯 Kullanım

### 1️⃣ Element Ekleme
- Sol sidebar'dan bir element seçin
- Canvas alanına sürükleyip bırakın
- Element otomatik olarak yerleşir

### 2️⃣ Element Düzenleme
- Canvas'ta bir elemente tıklayın
- Sağdaki Properties Panel'den özellikleri düzenleyin
- Content, position, size ve z-index ayarları yapabilirsiniz

### 3️⃣ Element Taşıma
- Seçili elementi mouse ile sürükleyin
- Grid snap aktifse elementin grid'e yapışır
- Klavye ok tuşları ile hassas ayar yapabilirsiniz (yakında)

### 4️⃣ Element Boyutlandırma
- Seçili elementin köşe veya kenar handle'larını kullanın
- Orantıyı korumak için Shift basılı tutun (yakında)

### 5️⃣ JSON Export
- Üst toolbar'daki "💾 Export JSON" butonuna tıklayın
- JSON dosyası otomatik olarak indirilir
- Bu dosyayı daha sonra import edebilirsiniz

### 6️⃣ JSON Import
- Üst toolbar'daki "📥 Import JSON" butonuna tıklayın
- Export ettiğiniz JSON dosyasını seçin
- Otomatik validation yapılır
- Başarılı import sonrası tüm elementler yüklenir

### 7️⃣ Responsive Design
- Element'i seçin
- Properties Panel'de "Responsive" bölümünü açın
- "+ Enable" butonuna tıklayın
- Mobile ve Tablet için özel width/height ayarlayın
- Toolbar'dan viewport değiştirerek test edin (🖥️ Desktop / 📱 Tablet / 📱 Mobile)

## ⌨️ Klavye Kısayolları

| Kısayol | İşlev |
|---------|-------|
| `Delete` / `Backspace` | Seçili elementi sil |
| `Esc` | Seçimi iptal et |
| `Cmd/Ctrl + C` | Kopyala (yakında) |
| `Cmd/Ctrl + V` | Yapıştır (yakında) |
| `Cmd/Ctrl + Z` | Geri al (yakında) |
| `Cmd/Ctrl + Shift + Z` | İleri al (yakında) |

## 🧩 Desteklenen Element Tipleri

### Header (☰)
- Site başlığı ve navigasyon
- Sticky pozisyon
- Logo ve menü linkleri

### Footer (▭)
- Alt bilgi alanı
- Copyright metni
- Footer linkleri

### Card (▢)
- İçerik kartı
- Başlık, açıklama, ikon
- Opsiyonel buton

### Text Content (📄)
- Metin içerik alanı
- Font boyutu ve hizalama
- HTML içerik desteği

### Slider (🖼️)
- Görsel slider/carousel
- Otomatik oynatma
- Navigation ve indicators

### Container (▦)
- Çok kolonlu container
- 1-3 kolon desteği
- Grid layout sistemi

## 📊 JSON Format

Export edilen JSON yapısı:

```json
{
  "project": {
    "name": "Project Name",
    "version": "1.0",
    "created": "2024-01-15T10:30:00Z",
    "lastModified": "2024-01-15T11:45:00Z"
  },
  "canvas": {
    "width": 1200,
    "height": 800,
    "grid": {
      "enabled": true,
      "size": 10,
      "snap": true
    }
  },
  "elements": [
    {
      "id": "elem_header_001",
      "type": "header",
      "content": { ... },
      "position": { ... },
      "responsive": { ... }
    }
  ],
  "metadata": {
    "totalElements": 5,
    "exportFormat": "json",
    "exportVersion": "2.0"
  }
}
```

## 🛠 Teknolojiler

- **React 19** - UI kütüphanesi
- **TypeScript 5.8** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **Context API** - State management

## 🔮 Yakında Gelecek Özellikler

- [ ] Undo/Redo sistemi
- [ ] Copy/Paste özelliği
- [ ] Multi-selection
- [ ] Alignment tools
- [ ] Template library
- [ ] Image upload
- [ ] Custom CSS editor
- [ ] Export to HTML/CSS
- [ ] Collaboration mode

## 📝 Lisans

MIT License

---

Geliştirici: Test Builder Team
Versiyon: 1.0.0
Son Güncelleme: 2024
