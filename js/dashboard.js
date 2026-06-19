function loadDashboard() {

    const tx =
    db.transaction(
        ["arsip"],
        "readonly"
    );

    const store =
    tx.objectStore(
        "arsip"
    );

    const request =
    store.getAll();

    request.onsuccess =
    function(){

        const data =
        request.result;

        // =========================
        // TOTAL ARSIP
        // =========================

        document
        .getElementById("totalArsip")
        .innerText =
        data.length;

        // =========================
        // HARI INI
        // =========================

        const today =
        new Date()
        .toISOString()
        .split("T")[0];

        const arsipHariIni =
        data.filter(
            x => x.tanggal === today
        );

        document
        .getElementById("arsipHariIni")
        .innerText =
        arsipHariIni.length;

        // =========================
        // BULAN INI
        // =========================

        const now =
        new Date();

        const bulanIni =
        now.getMonth() + 1;

        const tahunIni =
        now.getFullYear();

        const arsipBulanIni =
        data.filter(item=>{

            if(!item.tanggal)
                return false;

            const t =
            new Date(item.tanggal);

            return (
                t.getMonth()+1 === bulanIni
                &&
                t.getFullYear() === tahunIni
            );

        });

        document
        .getElementById("arsipBulanIni")
        .innerText =
        arsipBulanIni.length;

        // =========================
        // STORAGE
        // =========================

        let totalBytes = 0;

        data.forEach(item=>{

            if(item.fileData){

                totalBytes +=
                item.fileData.length;

            }

        });

        const totalMB =
        (
            totalBytes /
            1024 /
            1024
        ).toFixed(2);

        document
        .getElementById("storage")
        .innerText =
        totalMB + " MB";

        // =========================
        // KATEGORI
        // =========================

        const kategoriList = [

            "BC 2.3",
            "BC 2.5",
            "BC 2.6.1",
            "BC 2.6.2",
            "BC 2.7",
            "BC 3.0",
            "BC 4.0",
            "BC 4.1",
            "Lainnya"

        ];

        const kategoriCards =
        document.getElementById(
            "kategoriCards"
        );

        kategoriCards.innerHTML = "";

        kategoriList.forEach(kategori=>{

            const jumlah =
            data.filter(
                x => x.kategori === kategori
            ).length;

            kategoriCards.innerHTML += `

            <div class="col-md-3 mb-3">

                <div class="card stat-card p-3">

                    <h6>${kategori}</h6>

                    <h3>${jumlah}</h3>

                </div>

            </div>

            `;

        });

        // =========================
        // GRAFIK
        // =========================

        const labels = [];
        const values = [];

        kategoriList.forEach(kategori=>{

            labels.push(kategori);

            values.push(

                data.filter(
                    x => x.kategori === kategori
                ).length

            );

        });

        const chartCanvas =
        document.getElementById(
            "arsipChart"
        );

        if(window.arsipChartInstance){

            window.arsipChartInstance.destroy();

        }

            window.arsipChartInstance =
            new Chart(chartCanvas, {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [{

                        label:
                        "Jumlah Arsip",

                        data: values

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins:{
                        legend:{
                            display:true
                        }
                    }

                }

            });

        }

    };

}