
# Etkinlik Uygulaması (Frontend)

Bu depo, kullanıcıların etkinlikleri keşfedebildiği, kendi etkinliklerini oluşturup yönetebildiği ve diğer katılımcılarla etkileşime geçebildiği projenin kullanıcı arayüzünü (frontend) içerir. Modern web standartlarına uygun olarak Angular 21 ve Server-Side Rendering (SSR) kullanılarak geliştirilmiştir.

## Temel Özellikler

-   **Kullanıcı Kimlik Doğrulaması:** Güvenli giriş ve kayıt işlemleri ile yetkilendirme korumaları (Auth Guards) sayesinde güvenli oturum yönetimi.
    
-   **Etkinlik Yönetimi:** Yeni etkinlik oluşturma, mevcut etkinlikleri düzenleme, detayları görüntüleme ve sistem içerisindeki etkinlikler arası arama yapma.
    
-   **İçerik Organizasyonu:** Kullanıcıların etkinliklerini yayına almadan önce taslak (My Drafts) olarak kaydedebilmesi veya eski etkinlikleri arşivleyebilmesi (My Archives).
    
-   **Gelişmiş Profil Sistemi:** Kullanıcıların kendi kişisel profil sayfasını yönetebilmesi ve dinamik yönlendirme ile diğer kullanıcıların profillerini görüntüleyebilmesi.
    
-   **Arama Motoru Optimizasyonu (SEO):** Angular Express entegrasyonu sayesinde SSR destekli hızlı ilk sayfa yüklemesi ve yüksek arama motoru görünürlüğü.
    
-   **Duyarlı Tasarım (Responsive):** Bootstrap 5 framework entegrasyonu ile tüm mobil cihazlarda ve masaüstü ekranlarda kusursuz çalışan arayüz.
    

## Kullanılan Teknolojiler

-   **Framework:** Angular (Sürüm 21.2.0)
    
-   **Programlama Dili:** TypeScript (Sürüm 5.9.2)
    
-   **Stil ve Tasarım:** Bootstrap (Sürüm 5.3.2)
    
-   **Sunucu Tarafı Oluşturma (SSR):** Express ve @angular/ssr
    
-   **Birim Testleri (Unit Testing):** Vitest ve JSDOM
    
-   **Kod Biçimlendirme:** Prettier
    
-   **Paket Yöneticisi:** npm
    

## Rota Yapısı ve Yönlendirme

Uygulama mimarisi, yetkisiz erişimleri engellemek ve kullanıcı deneyimini optimize etmek için modüler bir rota yapısı kullanır:

**Genel Rotalar (Giriş Yapmamış Kullanıcılar İçin)**

-   `/` - Giriş Ekranı (Login)
    
-   `/register` - Yeni Kullanıcı Kayıt Ekranı (Register)
    

**Korumalı Rotalar (Sadece Oturum Açmış Kullanıcılar İçin)**

-   `/events` - Tüm etkinliklerin listelendiği ana akış
    
-   `/event/search` - Etkinlik arama ve filtreleme sayfası
    
-   `/events/:id` - Belirli bir etkinliğin detay sayfası
    
-   `/create-event` - Yeni etkinlik oluşturma arayüzü
    
-   `/events/:id/edit` - Mevcut bir etkinliği düzenleme arayüzü
    
-   `/my-drafts` - Henüz yayınlanmamış taslak etkinlikler
    
-   `/my-archives` - Geçmiş veya arşive alınmış etkinlikler
    
-   `/profile/me` - Aktif kullanıcının kişisel profil yönetim sayfası
    
-   `/profile/:nickname` - Belirli bir kullanıcının (kullanıcı adına göre) herkese açık profil sayfası
    

## Kurulum ve Geliştirme Ortamı

Projeyi kendi bilgisayarınızda çalıştırmak için Node.js ve npm'in sisteminizde kurulu olması gerekmektedir.

1.  Depoyu bilgisayarınıza klonlayın ve terminal üzerinden proje dizinine gidin.
    
2.  Gerekli kütüphane ve bağımlılıkları yükleyin:
    

Bash

```
npm install

```

3.  Geliştirme sunucusunu başlatın:
    

Bash

```
npm start

```

Uygulama varsayılan olarak `http://localhost:4200/` adresinde çalışacaktır. Dosyalarda yaptığınız değişiklikler tarayıcıya otomatik olarak yansır (Hot Module Replacement).

## Sunucu Tarafı Oluşturma (SSR) ile Çalıştırma

Projeyi üretim (production) ortamına benzer bir şekilde, SSR özellikleri aktif olarak test etmek isterseniz aşağıdaki komutları kullanabilirsiniz:

1.  Projeyi dağıtım için derleyin:
    

Bash

```
npm run build

```

2.  Node.js tabanlı Express sunucusunu ayağa kaldırın:
    

Bash

```
npm run serve:ssr:etkinlik-uygulamasi-frontend

```

## Test ve Kod Biçimlendirme

Projenin test altyapısı, geleneksel araçlar yerine modern ve hızlı bir alternatif olan Vitest üzerine kurulmuştur.

-   Birim testlerini (Unit Tests) çalıştırmak için aşağıdaki komutu kullanın:
    

Bash

```
npm run test

```

-   Proje genelinde temiz ve standart bir kod yapısı sağlamak için Prettier yapılandırılmıştır. Dosya kayıtlarında standart dışı boşluklar veya sekme kaymaları Prettier tarafından otomatik olarak düzenlenebilir.# Etkinlik Uygulaması (Frontend)

Bu depo, kullanıcıların etkinlikleri keşfedebildiği, kendi etkinliklerini oluşturup yönetebildiği ve diğer katılımcılarla etkileşime geçebildiği projenin kullanıcı arayüzünü (frontend) içerir. Modern web standartlarına uygun olarak Angular 21 ve Server-Side Rendering (SSR) kullanılarak geliştirilmiştir.

## Temel Özellikler

-   **Kullanıcı Kimlik Doğrulaması:** Güvenli giriş ve kayıt işlemleri ile yetkilendirme korumaları (Auth Guards) sayesinde güvenli oturum yönetimi.
    
-   **Etkinlik Yönetimi:** Yeni etkinlik oluşturma, mevcut etkinlikleri düzenleme, detayları görüntüleme ve sistem içerisindeki etkinlikler arası arama yapma.
    
-   **İçerik Organizasyonu:** Kullanıcıların etkinliklerini yayına almadan önce taslak (My Drafts) olarak kaydedebilmesi veya eski etkinlikleri arşivleyebilmesi (My Archives).
    
-   **Gelişmiş Profil Sistemi:** Kullanıcıların kendi kişisel profil sayfasını yönetebilmesi ve dinamik yönlendirme ile diğer kullanıcıların profillerini görüntüleyebilmesi.
    
-   **Arama Motoru Optimizasyonu (SEO):** Angular Express entegrasyonu sayesinde SSR destekli hızlı ilk sayfa yüklemesi ve yüksek arama motoru görünürlüğü.
    
-   **Duyarlı Tasarım (Responsive):** Bootstrap 5 framework entegrasyonu ile tüm mobil cihazlarda ve masaüstü ekranlarda kusursuz çalışan arayüz.
    

## Kullanılan Teknolojiler

-   **Framework:** Angular (Sürüm 21.2.0)
    
-   **Programlama Dili:** TypeScript (Sürüm 5.9.2)
    
-   **Stil ve Tasarım:** Bootstrap (Sürüm 5.3.2)
    
-   **Sunucu Tarafı Oluşturma (SSR):** Express ve @angular/ssr
    
-   **Birim Testleri (Unit Testing):** Vitest ve JSDOM
    
-   **Kod Biçimlendirme:** Prettier
    
-   **Paket Yöneticisi:** npm
    

## Rota Yapısı ve Yönlendirme

Uygulama mimarisi, yetkisiz erişimleri engellemek ve kullanıcı deneyimini optimize etmek için modüler bir rota yapısı kullanır:

**Genel Rotalar (Giriş Yapmamış Kullanıcılar İçin)**

-   `/` - Giriş Ekranı (Login)
    
-   `/register` - Yeni Kullanıcı Kayıt Ekranı (Register)
    

**Korumalı Rotalar (Sadece Oturum Açmış Kullanıcılar İçin)**

-   `/events` - Tüm etkinliklerin listelendiği ana akış
    
-   `/event/search` - Etkinlik arama ve filtreleme sayfası
    
-   `/events/:id` - Belirli bir etkinliğin detay sayfası
    
-   `/create-event` - Yeni etkinlik oluşturma arayüzü
    
-   `/events/:id/edit` - Mevcut bir etkinliği düzenleme arayüzü
    
-   `/my-drafts` - Henüz yayınlanmamış taslak etkinlikler
    
-   `/my-archives` - Geçmiş veya arşive alınmış etkinlikler
    
-   `/profile/me` - Aktif kullanıcının kişisel profil yönetim sayfası
    
-   `/profile/:nickname` - Belirli bir kullanıcının (kullanıcı adına göre) herkese açık profil sayfası
    

## Kurulum ve Geliştirme Ortamı

Projeyi kendi bilgisayarınızda çalıştırmak için Node.js ve npm'in sisteminizde kurulu olması gerekmektedir.

1.  Depoyu bilgisayarınıza klonlayın ve terminal üzerinden proje dizinine gidin.
    
2.  Gerekli kütüphane ve bağımlılıkları yükleyin:
    

Bash

```
npm install

```

3.  Geliştirme sunucusunu başlatın:
    

Bash

```
npm start

```

Uygulama varsayılan olarak `http://localhost:4200/` adresinde çalışacaktır. Dosyalarda yaptığınız değişiklikler tarayıcıya otomatik olarak yansır (Hot Module Replacement).

## Sunucu Tarafı Oluşturma (SSR) ile Çalıştırma

Projeyi üretim (production) ortamına benzer bir şekilde, SSR özellikleri aktif olarak test etmek isterseniz aşağıdaki komutları kullanabilirsiniz:

1.  Projeyi dağıtım için derleyin:
    

Bash

```
npm run build

```

2.  Node.js tabanlı Express sunucusunu ayağa kaldırın:
    

Bash

```
npm run serve:ssr:etkinlik-uygulamasi-frontend

```

## Test ve Kod Biçimlendirme

Projenin test altyapısı, geleneksel araçlar yerine modern ve hızlı bir alternatif olan Vitest üzerine kurulmuştur.

-   Birim testlerini (Unit Tests) çalıştırmak için aşağıdaki komutu kullanın:
    

Bash

```
npm run test

```

-   Proje genelinde temiz ve standart bir kod yapısı sağlamak için Prettier yapılandırılmıştır. Dosya kayıtlarında standart dışı boşluklar veya sekme kaymaları Prettier tarafından otomatik olarak düzenlenebilir.
