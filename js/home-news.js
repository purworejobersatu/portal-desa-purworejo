/* ==========================================
   BERITA BERANDA
========================================== */

const HomeNews = {
    data: [],
    async init() {
        console.log("Memuat berita beranda...");
        this.data = await PortalAPI.berita();
        console.log(this.data);
        this.render();
    },
    render() {
        const container = document.getElementById("homeNews");
        if (!container) return;
        container.innerHTML = "";
        if (this.data.length === 0) {
            container.innerHTML = `<div class="empty-news"><i class="bi bi-newspaper"></i><p>Belum ada berita.</p></div>`;
            return;
        }
        const berita = this.data.slice(0, 3);
        berita.forEach(item => {
            container.innerHTML += `
                <article class="news-card" data-aos="fade-up">
                    <img src="${item.thumbnail_drive || 'https://via.placeholder.com/400x250?text=Berita+Desa'}" alt="${item.judul}" onerror="this.src='https://via.placeholder.com/400x250?text=Berita+Desa'">
                    <div class="news-content">
                        <span>${Helper.tanggal(item.tanggal)}</span>
                        <h3>${item.judul}</h3>
                        <p>${item.ringkasan}</p>
                        <a href="detail-berita.html?id=${item.id}">Baca Selengkapnya <i class="bi bi-arrow-right"></i></a>
                    </div>
                </article>
            `;
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    HomeNews.init();
});