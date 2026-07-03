/* ==========================================
   HELPER FUNCTIONS
========================================== */

const Helper = {
    number(nilai) {
        nilai = Number(nilai) || 0;
        return nilai.toLocaleString("id-ID");
    },
    tanggal(tanggal) {
        if (!tanggal) return "-";
        return new Date(tanggal).toLocaleDateString("id-ID", {
            day: "2-digit", month: "long", year: "numeric"
        });
    },
    waktu(tanggal) {
        if (!tanggal) return "-";
        return new Date(tanggal).toLocaleTimeString("id-ID", {
            hour: "2-digit", minute: "2-digit"
        });
    },
    datetime(tanggal) {
        if (!tanggal) return "-";
        return this.tanggal(tanggal) + " " + this.waktu(tanggal);
    },
    kosong(data) {
        return data === null || data === undefined || data === "";
    },
    el(id) { return document.getElementById(id); },
    html(id, isi) {
        const obj = this.el(id);
        if (obj) obj.innerHTML = isi;
    },
    text(id, isi) {
        const obj = this.el(id);
        if (obj) obj.textContent = isi;
    },
    show(id) {
        const obj = this.el(id);
        if (obj) obj.style.display = "block";
    },
    hide(id) {
        const obj = this.el(id);
        if (obj) obj.style.display = "none";
    },
    scrollTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
};