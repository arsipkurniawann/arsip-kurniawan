let db;

const request = indexedDB.open(
    "ArsipKurniawanDB",
    2
);

request.onupgradeneeded = function(event){

    db = event.target.result;

    // STORE ARSIP

    if(!db.objectStoreNames.contains("arsip")){

        const arsipStore =
        db.createObjectStore(
            "arsip",
            {
                keyPath:"id",
                autoIncrement:true
            }
        );

        arsipStore.createIndex(
            "kategori",
            "kategori",
            {
                unique:false
            }
        );

    }

    // STORE USER

    if(!db.objectStoreNames.contains("users")){

        const userStore =
        db.createObjectStore(
            "users",
            {
                keyPath:"id",
                autoIncrement:true
            }
        );

        userStore.add({

            username:"admin",
            password:"admin123",
            role:"admin"

        });

        userStore.add({

            username:"user",
            password:"user123",
            role:"user"

        });

        userStore.add({

            username:"viewer",
            password:"viewer123",
            role:"viewer"

        });

    }

};

request.onsuccess = function(event){

    db = event.target.result;

    console.log("Database siap digunakan");

    if(typeof loadDashboard === "function"){
        loadDashboard();
    }

};

request.onerror = function(event){

    console.error(
        "Database gagal dibuat"
    );

};