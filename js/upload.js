/*
====================================================
Arsip Kurniawan v1.0
Sprint 1
upload.js
Google Drive Version
====================================================
*/

"use strict";

/*
====================================================
Role Validation
====================================================
*/

if (localStorage.getItem("role") === "viewer") {
    alert("Viewer tidak memiliki akses upload arsip.");
    location.href = "dashboard.html";
}

/*
====================================================
Element
====================================================
*/

const kategoriSelect = document.getElementById("kategori");
const ajuSection = document.getElementById("ajuSection");

const noAjuInput = document.getElementById("noAju");
const nomorPendaftaranInput = document.getElementById("nomorPendaftaran");

const namaDokumenInput = document.getElementById("namaDokumen");
const tanggalInput = document.getElementById("tanggal");

const jamInInput = document.getElementById("jamIn");
const jamOutInput = document.getElementById("jamOut");

const keteranganInput = document.getElementById("keterangan");

const fileInput = document.getElementById("fileArsip");

const progressContainer =
    document.getElementById("uploadProgressContainer");

const progressBar =
    document.getElementById("uploadProgress");

const uploadStatus =
    document.getElementById("uploadStatus");

const selectedFile =
    document.getElementById("selectedFile");

/*
====================================================
Apps Script URL
====================================================
*/

const API_URL = getApiUrl();

/*
====================================================
Initialize
====================================================
*/

window.addEventListener("DOMContentLoaded", () => {

    toggleKategori();

    tampilkanNamaFile();

    resetProgress();

});

/*
====================================================
Event
====================================================
*/

kategoriSelect.addEventListener("change", toggleKategori);

fileInput.addEventListener("change", tampilkanNamaFile);

/*
====================================================
Kategori
====================================================
*/

function toggleKategori() {

    const kategori = kategoriSelect.value;

    if (kategori === "Lainnya") {

        ajuSection.style.display = "none";

        noAjuInput.value = "";

        nomorPendaftaranInput.value = "";

    } else {

        ajuSection.style.display = "block";

    }

}

/*
====================================================
Nama File
====================================================
*/

function tampilkanNamaFile() {

    if (!fileInput.files.length) {

        selectedFile.innerHTML =
            "Belum ada file dipilih";

        return;

    }

    const file = fileInput.files[0];

    selectedFile.innerHTML =
        "<strong>File :</strong> " +
        file.name +
        " (" +
        formatUkuran(file.size) +
        ")";

}

/*
====================================================
Progress
====================================================
*/

function tampilkanProgress(persen, pesan = "") {

    progressContainer.classList.remove("d-none");

    progressBar.style.width = persen + "%";

    progressBar.innerHTML = persen + "%";

    uploadStatus.innerHTML = pesan;

}

function resetProgress() {

    progressContainer.classList.add("d-none");

    progressBar.style.width = "0%";

    progressBar.innerHTML = "0%";

    uploadStatus.innerHTML = "";

}

/*
====================================================
Format File Size
====================================================
*/

function formatUkuran(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }

    if (bytes < 1024 * 1024) {

        return (bytes / 1024).toFixed(2) + " KB";

    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}

/*
====================================================
Generate Nomor Arsip
====================================================
*/

function generateNomorArsip() {

    const now = new Date();

    const tahun = now.getFullYear();

    const bulan = String(now.getMonth() + 1).padStart(2, "0");

    const tanggal = String(now.getDate()).padStart(2, "0");

    const jam = String(now.getHours()).padStart(2, "0");

    const menit = String(now.getMinutes()).padStart(2, "0");

    const detik = String(now.getSeconds()).padStart(2, "0");

    return `AK-${tahun}${bulan}${tanggal}-${jam}${menit}${detik}`;

}

/*
====================================================
Validasi Form
====================================================
*/

function validateForm() {

    const kategori = kategoriSelect.value.trim();

    const noAju = noAjuInput.value.trim();

    const nomorPendaftaran =
        nomorPendaftaranInput.value.trim();

    const namaDokumen =
        namaDokumenInput.value.trim();

    const tanggal =
        tanggalInput.value;

    const file =
        fileInput.files[0];

    if (!kategori) {

        alert("Kategori wajib dipilih.");

        return false;

    }

    if (kategori !== "Lainnya") {

        if (noAju.length < 5 || noAju.length > 26) {

            alert("Nomor Aju harus 5 - 26 karakter.");

            noAjuInput.focus();

            return false;

        }

        if (!/^\d{6}$/.test(nomorPendaftaran)) {

            alert("Nomor Pendaftaran harus 6 digit.");

            nomorPendaftaranInput.focus();

            return false;

        }

    }

    if (namaDokumen === "") {

        alert("Nama Dokumen wajib diisi.");

        namaDokumenInput.focus();

        return false;

    }

    if (tanggal === "") {

        alert("Tanggal wajib diisi.");

        tanggalInput.focus();

        return false;

    }

    if (!file) {

        alert("Silakan pilih file PDF.");

        return false;

    }

    if (!isPdf(file)) {

        alert("Hanya file PDF yang diperbolehkan.");

        return false;

    }

    if (!isValidFileSize(file)) {

        alert(
            "Ukuran file maksimal " +
            (CONFIG.MAX_FILE_SIZE / 1024 / 1024) +
            " MB."
        );

        return false;

    }

    return true;

}

/*
====================================================
Build Payload
API Contract v1.0
====================================================
*/

function buildPayload(base64Content) {

    const file = fileInput.files[0];

    return {

        nomorArsip: generateNomorArsip(),

        kategori: kategoriSelect.value,

        noAju: noAjuInput.value.trim(),

        nomorPendaftaran:
            nomorPendaftaranInput.value.trim(),

        namaDokumen:
            namaDokumenInput.value.trim(),

        tanggal:
            tanggalInput.value,

        jamIn:
            jamInInput.value,

        jamOut:
            jamOutInput.value,

        keterangan:
            keteranganInput.value.trim(),

        file: {

            name: file.name,

            type: file.type,

            size: file.size,

            content: base64Content

        },

        uploadedBy:
            localStorage.getItem("username") || "admin",

        appVersion:
            CONFIG.VERSION

    };

}

/*
====================================================
Convert File to Base64
====================================================
*/

function readFileAsBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function () {

            const base64 =
                reader.result.split(",")[1];

            resolve(base64);

        };

        reader.onerror = function () {

            reject("Gagal membaca file.");

        };

        reader.readAsDataURL(file);

    });

}

/*
====================================================
Save Offline Cache
====================================================
*/

function saveOfflineCache(serverData, payload){

    return new Promise((resolve, reject)=>{

        if(!db){

            resolve();

            return;

        }

        const tx =
        db.transaction(["arsip"], "readwrite");

        const store =
        tx.objectStore("arsip");

        const cacheData = {

            nomorArsip:
            payload.nomorArsip,

            kategori:
            payload.kategori,

            noAju:
            payload.noAju,

            nomorPendaftaran:
            payload.nomorPendaftaran,

            namaDokumen:
            payload.namaDokumen,

            tanggal:
            payload.tanggal,

            jamIn:
            payload.jamIn,

            jamOut:
            payload.jamOut,

            keterangan:
            payload.keterangan,

            fileName:
            payload.file.name,

            fileType:
            payload.file.type,

            fileSize:
            payload.file.size,

            driveFileId:
            serverData.fileId,

            driveUrl:
            serverData.url,

            spreadsheetId:
            serverData.spreadsheetId || "",

            syncStatus:
            "SYNCED",

            uploadedBy:
            payload.uploadedBy,

            version:
            CONFIG.VERSION,

            createdAt:
            new Date().toISOString()

        };

        store.add(cacheData);

        tx.oncomplete = function(){

            resolve();

        };

        tx.onerror = function(event){

            reject(event.target.error);

        };

    });

}

/*
====================================================
Main Upload Function
====================================================
*/

async function simpanArsip() {

    if (!validateForm()) {

        return;

    }

    setFormDisabled(true);

    try {

        tampilkanProgress(
            10,
            "Membaca file..."
        );

        const file =
            fileInput.files[0];

        const base64 =
            await readFileAsBase64(file);

        tampilkanProgress(
            35,
            "Menyiapkan data..."
        );

        const payload =
            buildPayload(base64);

        /*
        ==========================================
        Upload ke Google Apps Script
        Akan dikerjakan pada Bagian 3
        ==========================================
        */

        tampilkanProgress(
            60,
            "Mengupload ke Google Drive..."
        );

        const result =
            await uploadToServer(payload);

        if (!result || result.success !== true) {

            throw new Error(

                result?.message ||

                "Server mengembalikan respon yang tidak valid."

            );

        }

        tampilkanProgress(
            85,
            "Menyimpan cache..."
        );

        await saveOfflineCache(
            result,
            payload
        );

        tampilkanProgress(
            100,
            "Upload berhasil."
        );

        setTimeout(() => {

            showSuccess("Upload berhasil.");

            resetForm();

            location.href = "arsip.html";

        }, 700);

    }

    catch (err) {

    console.error(err);

    showError(err.message || String(err));

    resetProgress();

    }

    finally {

        setFormDisabled(false);

    }

}

/*
====================================================
API Request
====================================================
*/

async function uploadToServer(payload) {

    if (!API_URL) {

        throw new Error(
            "API_URL belum dikonfigurasi pada config.js"
        );

    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {

        controller.abort();

    }, CONFIG.REQUEST_TIMEOUT);

    tampilkanProgress(
        50,
        "Menghubungi server..."
    );

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            action: "upload",

            data: payload

        }),

        signal: controller.signal

    });

    const contentType =
        response.headers.get("content-type");

    if (
        !contentType ||
        !contentType.includes("application/json")
    ) {

        throw new Error(
            "Response server bukan JSON."
        );

    }

    clearTimeout(timeout);

    if (!response.ok) {

        throw new Error(
            "Server mengembalikan status " +
            response.status
        );

    }

    return await response.json();

}

/*
====================================================
Disable Form
====================================================
*/

function setFormDisabled(disabled){

    const elements = [

        kategoriSelect,
        noAjuInput,
        nomorPendaftaranInput,
        namaDokumenInput,
        tanggalInput,
        jamInInput,
        jamOutInput,
        keteranganInput,
        fileInput

    ];

    elements.forEach(element=>{

        if(element){

            element.disabled = disabled;

        }

    });

    const button =
    document.querySelector(
        'button[onclick="simpanArsip()"]'
    );

    if(button){

        button.disabled = disabled;

        button.innerHTML =
            disabled ?
            "Mengupload..." :
            "Simpan Arsip";

    }

}

/*
====================================================
Reset Form
====================================================
*/

function resetForm(){

    kategoriSelect.selectedIndex = 0;

    noAjuInput.value = "";

    nomorPendaftaranInput.value = "";

    namaDokumenInput.value = "";

    tanggalInput.value = "";

    jamInInput.value = "";

    jamOutInput.value = "";

    keteranganInput.value = "";

    fileInput.value = "";

    tampilkanNamaFile();

    toggleKategori();

    resetProgress();

}

/*
====================================================
Notification
====================================================
*/

function showSuccess(message){

    uploadStatus.className =
        "mt-2 text-success";

    uploadStatus.innerHTML =
        "✔ " + message;

}

function showError(message){

    uploadStatus.className =
        "mt-2 text-danger";

    uploadStatus.innerHTML =
        "✖ " + message;

}

/*
====================================================
Console
====================================================
*/

console.log(

    CONFIG.APP_NAME +
    " v" +
    CONFIG.VERSION +
    " Upload Module Loaded"

);

/*
====================================================
END OF FILE
upload.js
====================================================
*/