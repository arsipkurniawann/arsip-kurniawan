/*
====================================================
Arsip Kurniawan v1.0
Frontend Configuration
====================================================
*/

const CONFIG = Object.freeze({

    /*
    ==========================================
    Google Apps Script Web App
    ==========================================
    */

    API_URL: "https://script.google.com/macros/s/AKfycbyKXAqPGkZlvLWeuiTwFDFXEarjBYMx-VPmKpxxtI5_e_-jvdGRPz7IU7w48ZIAhu6I4A/exec",

    /*
    ==========================================
    Versi aplikasi
    ==========================================
    */

    VERSION: "1.0.0",

    /*
    ==========================================
    Maksimum ukuran upload
    20 MB
    ==========================================
    */

    MAX_FILE_SIZE: 20 * 1024 * 1024,

    /*
    ==========================================
    File yang diizinkan
    ==========================================
    */

    ALLOWED_TYPES: [
        "application/pdf"
    ],

    /*
    ==========================================
    Request timeout
    ==========================================
    */

    REQUEST_TIMEOUT: 120000,

    /*
    ==========================================
    Nama aplikasi
    ==========================================
    */

    APP_NAME: "Arsip Kurniawan"

});


/*
====================================================
Utility
====================================================
*/

function getApiUrl() {
    return CONFIG.API_URL;
}

function getAppVersion() {
    return CONFIG.VERSION;
}

function getMaxFileSize() {
    return CONFIG.MAX_FILE_SIZE;
}

function getAllowedTypes() {
    return CONFIG.ALLOWED_TYPES;
}

function isPdf(file) {

    if (!file) return false;

    return CONFIG.ALLOWED_TYPES.includes(file.type);

}

function isValidFileSize(file) {

    if (!file) return false;

    return file.size <= CONFIG.MAX_FILE_SIZE;

}