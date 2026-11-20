# Son Penaltı — ChatGPT uygulaması (taslak)

Bu klasör mevcut oyunu değiştirmeden ChatGPT içinde açılabilmesi için MCP sunucusu sağlar. Oyun dosyaları depo kökündeki `index.html`, `style.css`, `game.js` dosyalarından alınır.

## Yerel çalıştırma
Node.js 22+ ile depo kökünden:
```sh
cd chatgpt-app
npm install
npm start
```
Sunucu varsayılan olarak 8787 portunda açılır. MCP uç noktası: `POST /mcp`.

## ChatGPT testi ve yayınlama
1. Sunucuyu HTTPS destekleyen, sürekli çalışan bir Node.js barındırma hizmetine dağıtın. **GitHub Pages tek başına MCP sunucusunu çalıştırmaz.**
2. ChatGPT özel MCP uygulaması ekleme ekranına `https://SUNUCU-ADRESI/mcp` girin.
3. `oyunu_ac` aracını deneyin. Mobil görünüm, oyun kontrolleri, oyun içi kayıt ve iframe izinlerini test edin.
4. Yayın başvurusundan önce uygulama yönergelerini, gizlilik politikasını, alan adı doğrulamasını ve geliştirici uygunluk koşullarını tamamlayın.

Bu bir **ilk geliştirme taslağıdır**; canlı ChatGPT içinde henüz doğrulanmamıştır ve yayımlanmış değildir.
