/* ==========================================
   MODUL STATISTIK LENGKAP v2
   Filter Dusun/RW/RT + Grafik Chart.js + Usia
========================================== */

const Statistik = {
    data: [],
    charts: {},

    async init() {
        console.log("Statistik v2 dimulai...");
        this.data = await PortalAPI.penduduk();
        console.log(this.data);

        if (!this.data || this.data.length === 0) {
            console.warn("Data penduduk kosong");
            return;
        }

        this.renderDusun();
        this.renderRW();
        this.renderRT();
        this.updateStatistik();
        this.renderTable();
        this.initCharts();
        this.updateUsia();
        this.bindEvent();
    },

    renderDusun() {
        const filter = document.getElementById("filterDusun");
        if (!filter) return;
        filter.innerHTML = '<option value="">Semua Dusun</option>';
        const daftar = [...new Set(this.data.map(item => item.dusun))].sort();
        daftar.forEach(d => {
            filter.innerHTML += `<option value="${d}">${d}</option>`;
        });
    },

    renderRW() {
        const filterDusun = document.getElementById("filterDusun");
        const filterRW = document.getElementById("filterRW");
        if (!filterRW) return;

        let data = [...this.data];
        if (filterDusun && filterDusun.value !== "") {
            data = data.filter(item => item.dusun === filterDusun.value);
        }

        filterRW.innerHTML = '<option value="">Semua RW</option>';
        const daftar = [...new Set(data.map(item => item.rw))].sort((a,b) => a-b);
        daftar.forEach(rw => {
            filterRW.innerHTML += `<option value="${rw}">RW ${rw}</option>`;
        });
    },

    renderRT() {
        const filterDusun = document.getElementById("filterDusun");
        const filterRW = document.getElementById("filterRW");
        const filterRT = document.getElementById("filterRT");
        if (!filterRT) return;

        let data = [...this.data];
        if (filterDusun && filterDusun.value !== "") {
            data = data.filter(item => item.dusun === filterDusun.value);
        }
        if (filterRW && filterRW.value !== "") {
            data = data.filter(item => item.rw === filterRW.value);
        }

        filterRT.innerHTML = '<option value="">Semua RT</option>';
        const daftar = [...new Set(data.map(item => item.rt))].sort((a,b) => a-b);
        daftar.forEach(rt => {
            filterRT.innerHTML += `<option value="${rt}">RT ${rt}</option>`;
        });
    },

    getDataFilter() {
        const filterDusun = document.getElementById("filterDusun");
        const filterRW = document.getElementById("filterRW");
        const filterRT = document.getElementById("filterRT");

        let data = [...this.data];
        if (filterDusun && filterDusun.value !== "") {
            data = data.filter(item => item.dusun === filterDusun.value);
        }
        if (filterRW && filterRW.value !== "") {
            data = data.filter(item => item.rw === filterRW.value);
        }
        if (filterRT && filterRT.value !== "") {
            data = data.filter(item => item.rt === filterRT.value);
        }
        return data;
    },

    updateStatistik() {
        const data = this.getDataFilter();
        let totalPenduduk = 0, totalKK = 0, totalLaki = 0, totalPerempuan = 0;
        const daftarDusun = new Set(), daftarRW = new Set(), daftarRT = new Set();

        data.forEach(item => {
            totalPenduduk += Number(item.jumlah_penduduk || 0);
            totalKK += Number(item.kk || 0);
            totalLaki += Number(item.laki_laki || 0);
            totalPerempuan += Number(item.perempuan || 0);
            daftarDusun.add(item.dusun);
            daftarRW.add(item.dusun + "-" + item.rw);
            daftarRT.add(item.dusun + "-" + item.rw + "-" + item.rt);
        });

        this.setText("totalPenduduk", totalPenduduk.toLocaleString("id-ID"));
        this.setText("totalKK", totalKK.toLocaleString("id-ID"));
        this.setText("totalLaki", totalLaki.toLocaleString("id-ID"));
        this.setText("totalPerempuan", totalPerempuan.toLocaleString("id-ID"));
        this.setText("totalDusun", daftarDusun.size);
        this.setText("totalRW", daftarRW.size);
        this.setText("totalRT", daftarRT.size);
        this.setText("totalRumah", totalKK);

        const currentFilter = document.getElementById("currentFilter");
        if (currentFilter) {
            const fd = document.getElementById("filterDusun")?.value;
            const fr = document.getElementById("filterRW")?.value;
            const ft = document.getElementById("filterRT")?.value;
            if (!fd && !fr && !ft) currentFilter.textContent = "Seluruh Desa";
            else if (fd && !fr && !ft) currentFilter.textContent = `Dusun ${fd}`;
            else if (fd && fr && !ft) currentFilter.textContent = `Dusun ${fd}, RW ${fr}`;
            else currentFilter.textContent = `Dusun ${fd}, RW ${fr}, RT ${ft}`;
        }

        this.updateCharts(data);
        this.updateUsia(data);
        this.renderTable(data);
    },

    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    },

    renderTable(data = null) {
        const tbody = document.getElementById("pendudukTable");
        if (!tbody) return;
        const items = data || this.getDataFilter();

        if (items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center">Tidak ada data</td></tr>`;
            return;
        }

        tbody.innerHTML = items.map(item => `
            <tr>
                <td>${item.dusun}</td>
                <td>RW ${item.rw}</td>
                <td>RT ${item.rt}</td>
                <td>${Number(item.kk || 0).toLocaleString("id-ID")}</td>
                <td>${Number(item.jumlah_penduduk || 0).toLocaleString("id-ID")}</td>
                <td>${Number(item.laki_laki || 0).toLocaleString("id-ID")}</td>
                <td>${Number(item.perempuan || 0).toLocaleString("id-ID")}</td>
            </tr>
        `).join("");
    },

    updateUsia(data = null) {
        const items = data || this.getDataFilter();
        let balita = 0, anak = 0, remaja = 0, dewasa = 0, praLansia = 0, lansia = 0;

        items.forEach(item => {
            balita += Number(item.usia_balita || item.balita || 0);
            anak += Number(item.usia_anak || item.anak || 0);
            remaja += Number(item.usia_remaja || item.remaja || 0);
            dewasa += Number(item.usia_dewasa || item.dewasa || 0);
            praLansia += Number(item.usia_pra_lansia || item.pra_lansia || 0);
            lansia += Number(item.usia_lansia || item.lansia || 0);
        });

        this.setText("usiaBalita", balita.toLocaleString("id-ID"));
        this.setText("usiaAnak", anak.toLocaleString("id-ID"));
        this.setText("usiaRemaja", remaja.toLocaleString("id-ID"));
        this.setText("usiaDewasa", dewasa.toLocaleString("id-ID"));
        this.setText("usiaPraLansia", praLansia.toLocaleString("id-ID"));
        this.setText("usiaLansia", lansia.toLocaleString("id-ID"));

        if (this.charts.usia) {
            this.charts.usia.data.datasets[0].data = [balita, anak, remaja, dewasa, praLansia, lansia];
            this.charts.usia.update();
        }
    },

    initCharts() {
        // Penduduk Chart (Bar)
        const ctx1 = document.getElementById("pendudukChart");
        if (ctx1) {
            this.charts.penduduk = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Laki-laki', 'Perempuan'],
                    datasets: [{
                        label: 'Jumlah Penduduk',
                        data: [0, 0],
                        backgroundColor: ['#1565C0', '#E91E63'],
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }

        // Pendidikan Chart (Doughnut)
        const ctx2 = document.getElementById("pendidikanChart");
        if (ctx2) {
            this.charts.pendidikan = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['SD', 'SMP', 'SMA', 'Diploma', 'Sarjana'],
                    datasets: [{
                        data: [30, 25, 20, 15, 10],
                        backgroundColor: ['#1B5E20', '#1565C0', '#F9A825', '#E91E63', '#9C27B0'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        // Pekerjaan Chart (Pie)
        const ctx3 = document.getElementById("pekerjaanChart");
        if (ctx3) {
            this.charts.pekerjaan = new Chart(ctx3, {
                type: 'pie',
                data: {
                    labels: ['Petani', 'Buruh', 'Wiraswasta', 'PNS', 'Lainnya'],
                    datasets: [{
                        data: [40, 20, 15, 10, 15],
                        backgroundColor: ['#1B5E20', '#1565C0', '#F9A825', '#E91E63', '#78909C'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        // Agama Chart (Doughnut)
        const ctx4 = document.getElementById("agamaChart");
        if (ctx4) {
            this.charts.agama = new Chart(ctx4, {
                type: 'doughnut',
                data: {
                    labels: ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha'],
                    datasets: [{
                        data: [95, 3, 1, 0.5, 0.5],
                        backgroundColor: ['#1B5E20', '#1565C0', '#F9A825', '#E91E63', '#9C27B0'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        // Usia Chart (Bar)
        const ctx5 = document.getElementById("usiaChart");
        if (ctx5) {
            this.charts.usia = new Chart(ctx5, {
                type: 'bar',
                data: {
                    labels: ['Balita', 'Anak', 'Remaja', 'Dewasa', 'Pra Lansia', 'Lansia'],
                    datasets: [{
                        label: 'Jumlah Penduduk',
                        data: [0, 0, 0, 0, 0, 0],
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    },

    updateCharts(data) {
        let totalLaki = 0, totalPerempuan = 0;
        data.forEach(item => {
            totalLaki += Number(item.laki_laki || 0);
            totalPerempuan += Number(item.perempuan || 0);
        });

        if (this.charts.penduduk) {
            this.charts.penduduk.data.datasets[0].data = [totalLaki, totalPerempuan];
            this.charts.penduduk.update();
        }
    },

    bindEvent() {
        const filterDusun = document.getElementById("filterDusun");
        const filterRW = document.getElementById("filterRW");
        const filterRT = document.getElementById("filterRT");

        if (filterDusun) {
            filterDusun.addEventListener("change", () => {
                this.renderRW();
                this.renderRT();
                this.updateStatistik();
            });
        }
        if (filterRW) {
            filterRW.addEventListener("change", () => {
                this.renderRT();
                this.updateStatistik();
            });
        }
        if (filterRT) {
            filterRT.addEventListener("change", () => {
                this.updateStatistik();
            });
        }
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    await Statistik.init();
});