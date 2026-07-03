/* ==========================================
   POPUP FUNCTIONS
========================================== */

const Popup = {
    comingSoon(judul) {
        const modal = document.getElementById("comingSoonModal");
        const title = document.getElementById("comingTitle");
        const text = document.getElementById("comingText");
        if (!modal) return;
        title.innerHTML = judul;
        text.innerHTML = "Halaman <b>" + judul + "</b> sedang dalam tahap pengembangan.<br><br>Silakan kembali beberapa waktu lagi.";
        modal.style.display = "flex";
    },
    close() {
        const modal = document.getElementById("comingSoonModal");
        if (modal) modal.style.display = "none";
    }
};

function segeraHadir(menu) {
    Popup.comingSoon(menu);
}

function tutupComingSoon() {
    Popup.close();
}

window.onclick = function(event) {
    const modal = document.getElementById("comingSoonModal");
    if (event.target === modal) {
        Popup.close();
    }
};

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("active");
            const icon = menuToggle.querySelector("i");
            if (mainNav.classList.contains("active")) {
                icon.classList.remove("bi-list");
                icon.classList.add("bi-x-lg");
            } else {
                icon.classList.remove("bi-x-lg");
                icon.classList.add("bi-list");
            }
        });
    }
});