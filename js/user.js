if(localStorage.getItem("role") !== "admin"){

    alert("Akses ditolak");

    location.href =
    "dashboard.html";

}

function loadUsers(){

    const tx =
    db.transaction(
        ["users"],
        "readonly"
    );

    const store =
    tx.objectStore(
        "users"
    );

    const request =
    store.getAll();

    request.onsuccess =
    function(){

        const data =
        request.result;

        const table =
        document.getElementById(
            "userTable"
        );

        table.innerHTML = "";

        data.forEach((user,index)=>{

            table.innerHTML += `

            <tr>

                <td>${index+1}</td>

                <td>${user.username}</td>

                <td>${user.role}</td>

                <td>

                    <button
                    onclick="editUser(${user.id})"
                    class="btn btn-warning btn-sm">
                    Edit
                    </button>

                    <button
                    onclick="gantiPassword(${user.id})"
                    class="btn btn-info btn-sm">
                    Password
                    </button>

                    ${
                    user.username === "admin"

                    ?

                    `<button
                    class="btn btn-secondary btn-sm"
                    disabled>
                    Admin Utama
                    </button>`

                    :

                    `<button
                    onclick="hapusUser(${user.id})"
                    class="btn btn-danger btn-sm">
                    Hapus
                    </button>`
                    }

                </td>

            </tr>

            `;

        });

    };

}

function showTambahUser(){

    const username =
    prompt(
        "Username"
    );

    if(!username)
        return;

    const password =
    prompt(
        "Password"
    );

    if(!password)
        return;

    const role =
    prompt(
        "Role (admin/user)"
    );

    if(!role)
        return;

    const tx =
    db.transaction(
        ["users"],
        "readwrite"
    );

    const store =
    tx.objectStore(
        "users"
    );

    store.add({

        username:
        username,

        password:
        password,

        role:
        role

    });

    tx.oncomplete =
    function(){

        alert(
            "User berhasil ditambah"
        );

        loadUsers();

    };

}

function hapusUser(id){

    if(
        !confirm(
            "Hapus user ini?"
        )
    )
    return;

    const tx =
    db.transaction(
        ["users"],
        "readwrite"
    );

    const store =
    tx.objectStore(
        "users"
    );

    store.delete(id);

    tx.oncomplete =
    function(){

        loadUsers();

    };

}

function editUser(id){

    const tx =
    db.transaction(
        ["users"],
        "readonly"
    );

    const store =
    tx.objectStore("users");

    const req =
    store.get(id);

    req.onsuccess = ()=>{

        const user =
        req.result;

        const username =
        prompt(
            "Username baru",
            user.username
        );

        if(!username)
            return;

        const role =
        prompt(
            "Role (admin/user)",
            user.role
        );

        if(!role)
            return;

        user.username =
        username;

        user.role =
        role;

        const tx2 =
        db.transaction(
            ["users"],
            "readwrite"
        );

        tx2
        .objectStore("users")
        .put(user);

        tx2.oncomplete = ()=>{

            loadUsers();

            alert(
                "User berhasil diupdate"
            );

        };

    };

}

function gantiPassword(id){

    const password =
    prompt(
        "Password baru"
    );

    if(!password)
        return;

    const tx =
    db.transaction(
        ["users"],
        "readwrite"
    );

    const store =
    tx.objectStore(
        "users"
    );

    const req =
    store.get(id);

    req.onsuccess = ()=>{

        const user =
        req.result;

        user.password =
        password;

        store.put(user);

        alert(
            "Password berhasil diganti"
        );

    };

}

function backupDB(){

    const txUsers =
    db.transaction(
        ["users"],
        "readonly"
    );

    const txArsip =
    db.transaction(
        ["arsip"],
        "readonly"
    );

    const usersStore =
    txUsers.objectStore(
        "users"
    );

    const arsipStore =
    txArsip.objectStore(
        "arsip"
    );

    const usersReq =
    usersStore.getAll();

    const arsipReq =
    arsipStore.getAll();

    usersReq.onsuccess = ()=>{

        arsipReq.onsuccess = ()=>{

            const backupData = {

                users:
                usersReq.result,

                arsip:
                arsipReq.result

            };

            const blob =
            new Blob(
                [
                    JSON.stringify(
                        backupData,
                        null,
                        2
                    )
                ],
                {
                    type:
                    "application/json"
                }
            );

            const url =
            URL.createObjectURL(
                blob
            );

            const a =
            document.createElement(
                "a"
            );

            a.href = url;

            a.download =
            "backup-arsip.json";

            a.click();

            URL.revokeObjectURL(
                url
            );

        };

    };

}

function restoreDB(){

    const fileInput =
    document.getElementById(
        "restoreFile"
    );

    const file =
    fileInput.files[0];

    if(!file){

        alert(
            "Pilih file backup terlebih dahulu"
        );

        return;
    }

    const reader =
    new FileReader();

    reader.onload =
    function(e){

        const data =
        JSON.parse(
            e.target.result
        );

        const tx1 =
        db.transaction(
            ["users"],
            "readwrite"
        );

        const userStore =
        tx1.objectStore(
            "users"
        );

        userStore.clear();

        data.users.forEach(user=>{

            userStore.put(user);

        });

        const tx2 =
        db.transaction(
            ["arsip"],
            "readwrite"
        );

        const arsipStore =
        tx2.objectStore(
            "arsip"
        );

        arsipStore.clear();

        data.arsip.forEach(item=>{

            arsipStore.put(item);

        });

        tx2.oncomplete =
        function(){

            alert(
                "Restore berhasil"
            );

            loadUsers();

        };

    };

    reader.readAsText(file);

}

setTimeout(
    loadUsers,
    500
);