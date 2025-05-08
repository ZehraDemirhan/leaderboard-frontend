# Scalable Leaderboard System

## Projeye Genel Bakış

Bu projede **Next.js** tabanlı, hem masaüstü hem de mobil cihazlarda sorunsuz çalışan bir *leaderboard* arayüzü geliştirdim.

### Temel Özellikler

- Kullanıcıların sıralamalarını gösteren dört sütunlu bir tablo oluşturdum: **Country**, **Username**, **Rank**, **Money**.
- Tablo sütunları **sürükle-bırak** yöntemiyle yeniden sıralanabilir şekilde geliştirildi.
- Kullanıcılar, **ülkeye göre gruplayarak** tabloyu filtreleyebiliyor.
- Arama alanına **autocomplete** özelliği eklendi ve performans için **debounce** mantığı uygulandı.
- Gerçek zamanlı ödül dağıtımları için **Pusher.js** üzerinden gelen socket verileri dinlenerek arayüz anlık güncelleniyor.
- **Light** ve **dark mode** arasında geçiş yapılabilen bir tema sistemi geliştirildi.
- Tüm arayüz **styled-components** kullanılarak modüler bir yapıda oluşturuldu.
- Simge kullanımları için **MUI Icons** kütüphanesi tercih edildi.

**Not:** Sunucu kapasitesi nedeniyle şu anda veritabanında **100.000 kullanıcı** bulunmaktadır.
- Her **1 dakikada bir**, rastgele **100 kullanıcıya** Redis üzerinden başarı simüle edilip para ekleniyor.
- Her **3 dakikada bir**, en çok paraya sahip **ilk 100 kullanıcıya** ödüller dağıtılıyor.
- Bu süreler `.env` dosyasındaki değerlerle ayarlanabiliyor.
- Ödül dağıtımı sırasında kazanan kullanıcı arayüzde **altın rengiyle** vurgulanıyor ve havuzdan eksilen miktar görsel olarak yansıtılıyor.

---

## Frontend Overview

This is a fully responsive and interactive **leaderboard frontend** built with **Next.js** and **React**, optimized for both desktop and mobile experiences. It provides a dynamic, real-time interface with high usability and performance.

### Key Highlights

- **UI & Theming:** Built with `styled-components` and `MUI Icons`, featuring a full **light/dark mode** toggle and custom reusable components designed for both server and client rendering.
- **Search & Autocomplete:** A performant search bar with **debounce** logic and **autocomplete** suggestions, allowing instant filtering of players.
- **Drag-and-Drop Columns:** Implemented using `@hello-pangea/dnd` to enable **reorderable table columns**, enhancing user interactivity.
- **Group by Country:** Toggleable row grouping by country for better data segmentation and visualization.
- **Real-Time Sync:** Integrated with **Pusher.js** to listen to backend socket events for live updates during prize distributions and leaderboard changes.
- **Reusable Service Layer:** A base Axios service is abstracted via environment-based URLs, then extended by a specialized `LeaderboardService` for clean, maintainable API communication.
- **Mobile Friendly:** Fully responsive design tested across devices, ensuring smooth UX on various screen sizes.

This frontend works seamlessly with the backend to deliver a real-time, scalable leaderboard experience.

---

## Screenshots

<img width="1301" alt="Screenshot 2025-05-05 at 16 54 14" src="https://github.com/user-attachments/assets/9929d7d0-a6cf-47dc-b51b-02ba1616482a" />
<br/>
<img width="1313" alt="Screenshot 2025-05-05 at 17 07 33" src="https://github.com/user-attachments/assets/b7a28562-67be-4b7d-b92a-7b0bd5a32f90" />
