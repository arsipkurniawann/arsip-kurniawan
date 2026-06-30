let db;

const request = indexedDB.open("ArsipKurniawanDB", 4);

request.onupgradeneeded = function(event){
    db = event.target.result;

// =========================
// STORE ARSIP
// =========================

let arsipStore;

if (!db.objectStoreNames.contains("arsip")) {

    arsipStore = db.createObjectStore("arsip", {

        keyPath: "id",

        autoIncrement: true

    });

} else {

    arsipStore =
        event.target.transaction.objectStore("arsip");

}

/*
====================================
Index Lama
====================================
*/

if (!arsipStore.indexNames.contains("kategori")) {

    arsipStore.createIndex(
        "kategori",
        "kategori",
        { unique: false }
    );

}

if (!arsipStore.indexNames.contains("nomorArsip")) {

    arsipStore.createIndex(
        "nomorArsip",
        "nomorArsip",
        { unique: false }
    );

}

if (!arsipStore.indexNames.contains("namaDokumen")) {

    arsipStore.createIndex(
        "namaDokumen",
        "namaDokumen",
        { unique: false }
    );

}

if (!arsipStore.indexNames.contains("tanggal")) {

    arsipStore.createIndex(
        "tanggal",
        "tanggal",
        { unique: false }
    );

}

/*
====================================
Sprint 1 Google Drive
====================================
*/

    if (!arsipStore.indexNames.contains("driveFileId")) {

        arsipStore.createIndex(
            "driveFileId",
            "driveFileId",
            { unique: false }
        );

    }

    if (!arsipStore.indexNames.contains("syncStatus")) {

        arsipStore.createIndex(
            "syncStatus",
            "syncStatus",
            { unique: false }
        );

    }

    if (!arsipStore.indexNames.contains("uploadedBy")) {

        arsipStore.createIndex(
            "uploadedBy",
            "uploadedBy",
            { unique: false }
        );

    }

    if (!arsipStore.indexNames.contains("createdAt")) {

        arsipStore.createIndex(
            "createdAt",
            "createdAt",
            { unique: false }
        );

    }

    if (!arsipStore.indexNames.contains("driveUrl")) {

        arsipStore.createIndex(
            "driveUrl",
            "driveUrl",
            { unique: false }
        );

    }

    if (!arsipStore.indexNames.contains("spreadsheetId")) {

        arsipStore.createIndex(
            "spreadsheetId",
            "spreadsheetId",
            { unique: false }
        );

    }

    // =========================
    // STORE USERS
    // =========================
    if(!db.objectStoreNames.contains("users")){
        const userStore = db.createObjectStore("users", {
            keyPath: "id",
            autoIncrement: true
        });

        userStore.createIndex("username", "username", { unique: true });

        userStore.add({
            username: "admin",
            password: "admin123",
            role: "admin"
        });

        userStore.add({
            username: "user",
            password: "user123",
            role: "user"
        });

        userStore.add({
            username: "viewer",
            password: "viewer123",
            role: "viewer"
        });
    }
};

request.onsuccess = function(event){
    db = event.target.result;
    console.log("Database siap digunakan");

    if(typeof loadDashboard === "function"){
        loadDashboard();
    }

    if(typeof loadArsip === "function"){
        loadArsip();
    }
};

request.onerror = function(event){
    console.error("Database gagal dibuat", event.target.error);
};