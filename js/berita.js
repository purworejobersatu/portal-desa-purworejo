/* ==========================================
   MODUL BERITA
========================================== */

const Berita = {
    data: [],
    async init() {
        console.log("Memuat berita...");
        this.data = await PortalAPI.berita();
        console.log(this.data);
        this.render(this.data);
        this.search();
    },
    render(data) {
        const container = document.getElementById("newsContainer");
        if (!container) return;
        container.innerHTML = "";
        if (data.length === 0) {
            container.innerHTML = `<div class="empty-news"><i class="bi bi-newspaper"></i><p>Belum ada berita yang dipublikasikan.</p></div>`;
            return;
        }
        data.forEach(item => {
            container.innerHTML += `
                <div class="news-card" data-aos="fade-up">
                    <img src="${item.thumbnail_drive || 'https://via.placeholder.com/400x250?text=Berita+Desa'}" class="news-image" alt="${item.judul}" onerror="this.src='https://via.placeholder.com/400x250?text=Berita+Desa'">
                    <div class="news-body">
                        <div class="news-date">📅 ${Helper.tanggal(item.tanggal)}</div>
                        <div class="news-title">${item.judul}</div>
                        <div class="news-summary">${item.ringkasan}</div>
                        <a href="detail-berita.html?id=${item.id}" class="news-button">Baca Selengkapnya →</a>
                    </div>
                </div>
            `;
        });
    },
    search() {
        const input = document.getElementById("searchBerita");
        if (!input) return;
        input.addEventListener("keyup", () => {
            const keyword = input.value.toLowerCase();
            const hasil = this.data.filter(item =>
                item.judul.toLowerCase().includes(keyword) ||
                item.ringkasan.toLowerCase().includes(keyword)
            );
            this.render(hasil);
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Berita.init();
});