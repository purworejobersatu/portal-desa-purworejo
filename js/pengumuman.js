/* ==========================================
   PENGUMUMAN RUNNING TEXT
========================================== */

document.addEventListener("DOMContentLoaded", async () => {
    const data = await PortalAPI.pengumuman();
    const runningText = document.getElementById("runningText");
    if (!runningText) return;
    if (!data || data.length === 0) {
        runningText.textContent = "Belum ada pengumuman.";
        return;
    }
    const pengumuman = data
        .filter(item => item.status === "Publish")
        .map(item => `📢 ${item.judul} : ${item.isi}`)
        .join("  •  ");
    runningText.textContent = pengumuman;
});