const currentRole = localStorage.getItem("role");
let semuaArsip = [];

function loadArsip() {
    if (!db) {
        console.warn("Database belum siap");
        return;
    }

    const tx = db.transaction(["arsip"], "readonly");
    const store = tx.objectStore("arsip");
    const request = store.getAll();

    request.onsuccess = function () {
        semuaArsip = request.result || [];
        console.log("Data arsip ditemukan:", semuaArsip);
        renderArsip(semuaArsip);
    };

    request.onerror = function () {
        console.error("Gagal memuat data arsip");
        const tbody = document.getElementById("tbodyArsip");
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center text-danger">
                        Gagal memuat data arsip
                    </td>
                </tr>
            `;
        }
    };
}

function renderArsip(data) {
    const tbody = document.getElementById("tbodyArsip");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    Belum ada data arsip
                </td>
            </tr>
        `;
        return;
    }

    let nomor = 1;

    data.forEach(item => {
        const jamInOut =
            (item.jamIn || item.jamOut)
                ? `${item.jamIn || "-"} / ${item.jamOut || "-"}`
                : "-";

        tbody.innerHTML += `
            <tr>
                <td>${nomor++}</td>
                <td>${item.nomorArsip || "-"}</td>
                <td>${item.kategori || "-"}</td>
                <td>${item.noAju || "-"}</td>
                <td>${item.nomorPendaftaran || "-"}</td>
                <td>${item.namaDokumen || "-"}</td>
                <td>${item.tanggal || "-"}</td>
                <td>${jamInOut}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="lihatFile(${item.id})">
                        Lihat
                    </button>

                    <button class="btn btn-sm btn-success" onclick="downloadFile(${item.id})">
                        Download
                    </button>

                    ${currentRole !== "viewer" ? `
                        <button class="btn btn-sm btn-danger" onclick="hapusArsip(${item.id})">
                            Hapus
                        </button>
                    ` : ""}
                </td>
            </tr>
        `;
    });
}

function cariArsip() {
    const keyword = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const kategori = document.getElementById("filterKategori")?.value || "";

    const hasil = semuaArsip.filter(item => {
        const jamInOut = `${item.jamIn || ""} ${item.jamOut || ""}`.toLowerCase();

        const cocokKeyword =
            (item.nomorArsip || "").toLowerCase().includes(keyword) ||
            (item.kategori || "").toLowerCase().includes(keyword) ||
            (item.noAju || "").toLowerCase().includes(keyword) ||
            (item.nomorPendaftaran || "").toLowerCase().includes(keyword) ||
            (item.namaDokumen || "").toLowerCase().includes(keyword) ||
            (item.tanggal || "").toLowerCase().includes(keyword) ||
            jamInOut.includes(keyword);

        const cocokKategori =
            kategori === "" || item.kategori === kategori;

        return cocokKeyword && cocokKategori;
    });

    renderArsip(hasil);
}

function lihatFile(id) {
    const tx = db.transaction(["arsip"], "readonly");
    const store = tx.objectStore("arsip");
    const req = store.get(id);

    req.onsuccess = function () {
        const arsip = req.result;
        if (!arsip) return alert("File tidak ditemukan");

        const previewFrame = document.getElementById("previewFrame");
        if (previewFrame) {
            previewFrame.src = arsip.fileData;
        }

        const modalEl = document.getElementById("previewModal");
        if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }
    };

    req.onerror = function () {
        alert("Gagal membuka file");
    };
}

function downloadFile(id) {
    const tx = db.transaction(["arsip"], "readonly");
    const store = tx.objectStore("arsip");
    const req = store.get(id);

    req.onsuccess = function () {
        const arsip = req.result;
        if (!arsip) return alert("File tidak ditemukan");

        const a = document.createElement("a");
        a.href = arsip.fileData;
        a.download = arsip.fileName || "arsip";
        a.click();
    };

    req.onerror = function () {
        alert("Gagal download file");
    };
}

function hapusArsip(id) {
    if (currentRole === "viewer") {
        alert("Viewer tidak memiliki akses menghapus arsip");
        return;
    }

    if (!confirm("Hapus arsip ini?")) return;

    const tx = db.transaction(["arsip"], "readwrite");
    const store = tx.objectStore("arsip");
    store.delete(id);

    tx.oncomplete = function () {
        alert("Arsip berhasil dihapus");
        loadArsip();
    };

    tx.onerror = function () {
        alert("Gagal menghapus arsip");
    };
}

function exportExcel() {
    if (!semuaArsip.length) {
        alert("Belum ada data untuk diexport");
        return;
    }

    const dataExcel = semuaArsip.map(item => ({
        "No Arsip": item.nomorArsip || "",
        "Kategori": item.kategori || "",
        "No Aju": item.noAju || "",
        "No Daftar": item.nomorPendaftaran || "",
        "Nama Dokumen": item.namaDokumen || "",
        "Tanggal": item.tanggal || "",
        "Jam In/Out": (item.jamIn || item.jamOut)
            ? `${item.jamIn || "-"} / ${item.jamOut || "-"}`
            : "",
        "Keterangan": item.keterangan || "",
        "Nama File": item.fileName || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Arsip");
    XLSX.writeFile(workbook, "arsip.xlsx");
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const filterKategori = document.getElementById("filterKategori");

    if (searchInput) {
        searchInput.addEventListener("keyup", cariArsip);
    }

    if (filterKategori) {
        filterKategori.addEventListener("change", cariArsip);
    }

    // kalau db sudah siap, langsung load
    if (typeof db !== "undefined" && db) {
        loadArsip();
    } else {
        // tunggu sebentar kalau db.js belum selesai
        setTimeout(() => {
            if (typeof db !== "undefined" && db) {
                loadArsip();
            }
        }, 500);
    }
});