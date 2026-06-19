function loadDashboard() {

    if (!db) {
        console.log("Database belum siap");
        return;
    }

    const tx = db.transaction(["arsip"], "readonly");
    const store = tx.objectStore("arsip");
    const request = store.getAll();

    request.onsuccess = function () {

        const data = request.result || [];

        console.log("Data Arsip:", data);

        // TOTAL ARSIP
        document.getElementById("totalArsip").innerText = data.length;

        // HARI INI
        const today = new Date().toISOString().split("T")[0];

        const arsipHariIni = data.filter(item => {

            const tanggal =
                item.tanggal ||
                item.tanggalUpload ||
                item.createdAt;

            if (!tanggal) return false;

            return String(tanggal).substring(0, 10) === today;

        });

        document.getElementById("arsipHariIni").innerText =
            arsipHariIni.length;

        // BULAN INI
        const now = new Date();

        const bulanIni = now.getMonth();
        const tahunIni = now.getFullYear();

        const arsipBulanIni = data.filter(item => {

            const tanggal =
                item.tanggal ||
                item.tanggalUpload ||
                item.createdAt;

            if (!tanggal) return false;

            const t = new Date(tanggal);

            return (
                t.getMonth() === bulanIni &&
                t.getFullYear() === tahunIni
            );

        });

        document.getElementById("arsipBulanIni").innerText =
            arsipBulanIni.length;

        // STORAGE
        let totalBytes = 0;

        data.forEach(item => {

            if (item.fileData) {
                totalBytes += item.fileData.length;
            }

        });

        const totalMB =
            (totalBytes / 1024 / 1024).toFixed(2);

        document.getElementById("storage").innerText =
            totalMB + " MB";

        // KATEGORI DINAMIS
        const kategoriObj = {};

        data.forEach(item => {

            const kategori =
                item.kategori || "Lainnya";

            kategoriObj[kategori] =
                (kategoriObj[kategori] || 0) + 1;

        });

        const labels = Object.keys(kategoriObj);
        const values = Object.values(kategoriObj);

        // CARD KATEGORI
        const kategoriCards =
            document.getElementById("kategoriCards");

        kategoriCards.innerHTML = "";

        labels.forEach((kategori, index) => {

            kategoriCards.innerHTML += `
                <div class="col-md-3 mb-3">
                    <div class="card stat-card p-3">
                        <h6>${kategori}</h6>
                        <h3>${values[index]}</h3>
                    </div>
                </div>
            `;

        });

        // JIKA BELUM ADA DATA
        if (labels.length === 0) {

            labels.push("Belum Ada Arsip");
            values.push(0);

        }

        // HAPUS CHART LAMA
        if (window.arsipChartInstance) {
            window.arsipChartInstance.destroy();
        }

        const ctx =
            document.getElementById("arsipChart");

        window.arsipChartInstance =
            new Chart(ctx, {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [{
                        label: "Jumlah Arsip",
                        data: values
                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            });

    };

}