/* ==========================================
   DETAIL BERITA
========================================== */

const DetailBerita = {
    async init() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (!id) {
            document.getElementById("detailIsi").innerHTML = "<h3>Berita tidak ditemukan.</h3>";
            return;
        }
        const data = await PortalAPI.detailBerita(id);
        console.log(data);
        this.render(data);
        this.loadRelated(id);
    },
    render(data) {
        document.getElementById("detailJudul").innerHTML = data.judul;
        document.getElementById("detailKategori").innerHTML = data.kategori;
        document.getElementById("detailTanggal").innerHTML = Helper.tanggal(data.tanggal);
        document.getElementById("detailPenulis").innerHTML = data.penulis;
        document.getElementById("detailImage").src = data.thumbnail_drive || '';
        document.getElementById("detailIsi").innerHTML = data.isi;
        const tag = document.getElementById("detailTags");
        tag.innerHTML = "";
        if (data.tags) {
            data.tags.split(",").forEach(item => {
                tag.innerHTML += `<span>${item.trim()}</span>`;
            });
        }
    },
    async loadRelated(currentId) {
        const allNews = await PortalAPI.berita();
        if (!allNews) return;
        const related = allNews.filter(n => n.id != currentId).slice(0, 3);
        const container = document.getElementById("relatedNews");
        if (!container) return;
        container.innerHTML = "";
        related.forEach(item => {
            container.innerHTML += `
                <div class="news-card" data-aos="fade-up">
                    <img src="${item.thumbnail_drive || 'https://via.placeholder.com/400x250?text=Berita+Desa'}" class="news-image" alt="${item.judul}" onerror="this.src='https://via.placeholder.com/400x250?text=Berita+Desa'">
                    <div class="news-body">
                        <div class="news-date">📅 ${Helper.tanggal(item.tanggal)}</div>
                        <div class="news-title">${item.judul}</div>
                        <a href="detail-berita.html?id=${item.id}" class="news-button">Baca Selengkapnya →</a>
                    </div>
                </div>
            `;
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    DetailBerita.init();
});