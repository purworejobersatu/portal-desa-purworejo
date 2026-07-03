/* ==========================================
   API CLIENT
========================================== */

const PortalAPI = {
    async request(action) {
        try {
            const response = await fetch(`${CONFIG.API_URL}?action=${action}`);
            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            return null;
        }
    },
    async profil() { return await this.request("profil"); },
    async pengumuman() { return await this.request("pengumuman"); },
    async penduduk() { return await this.request("penduduk"); },
    async berita() { return await this.request("berita"); },
    async detailBerita(id) { return await this.request("detailBerita&id=" + id); }
};