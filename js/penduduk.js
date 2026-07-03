/* ==========================================
   PENDUDUK - HOMEPAGE STATS
========================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const data = await PortalAPI.penduduk();
    if (!data) return;

    let totalPenduduk = 0;
    let totalKK = 0;
    const daftarRT = new Set();
    const daftarRW = new Set();

    data.forEach(item => {
        totalPenduduk += Number(item.jumlah_penduduk || 0);
        totalKK += Number(item.kk || 0);
        daftarDusun.add(item.dusun);
        daftarRW.add(item.dusun + "-" + item.rw);
        daftarRT.add(item.dusun + "-" + item.rw + "-" + item.rt);
    });

    // Animate counters
    animateValue("totalPenduduk", 0, totalPenduduk, 1500);
    animateValue("totalKK", 0, totalKK, 1500);
    animateValue("totalRT", 0, daftarRT.size, 1500);
    animateValue("totalRW", 0, daftarRW.size, 1500);
});

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;

    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        obj.textContent = value.toLocaleString("id-ID");
        if (value == end) clearInterval(timer);
    }

    timer = setInterval(run, stepTime);
    run();
}