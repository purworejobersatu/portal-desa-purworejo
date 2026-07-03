/* ==========================================
   PROFIL DESA
========================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const profil = await PortalAPI.profil();
    if (!profil) return;
    const namaEl = document.getElementById("namaDesa");
    const wilayahEl = document.getElementById("wilayah");
    if (namaEl) namaEl.textContent = "PEMERINTAH DESA " + profil.nama_desa.toUpperCase();
    if (wilayahEl) wilayahEl.textContent = "Kecamatan " + profil.kecamatan + " • Kabupaten " + profil.kabupaten;
});