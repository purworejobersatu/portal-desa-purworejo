/* ==========================================
   MAIN JS - PORTAL DESA v2.0
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Header scroll effect
    const header = document.getElementById("header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                header.style.boxShadow = "0 4px 20px rgba(0,0,0,.1)";
            } else {
                header.style.boxShadow = "0 2px 15px rgba(0,0,0,.06)";
            }
        });
    }

    // Coming soon modal
    const modal = document.createElement("div");
    modal.id = "comingSoonModal";
    modal.className = "coming-modal";
    modal.innerHTML = `
        <div class="coming-content">
            <div class="coming-icon">🚧</div>
            <h2 id="comingTitle">Segera Hadir</h2>
            <p id="comingText">Halaman ini sedang dalam tahap pengembangan.</p>
            <button onclick="tutupComingSoon()">Tutup</button>
        </div>
    `;
    document.body.appendChild(modal);
});