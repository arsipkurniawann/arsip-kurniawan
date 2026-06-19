const currentRole =
localStorage.getItem("role");

let semuaArsip = [];

function loadArsip(){

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

        semuaArsip = data;

        renderArsip(data);

    };

}

function renderArsip(data){

    const tbody =
    document.getElementById(
        "tbodyArsip"
    );

    tbody.innerHTML = "";

    if(data.length === 0){

        tbody.innerHTML = `
        <tr>
            <td colspan="7"
            class="text-center">
            Data tidak ditemukan
            </td>
        </tr>
        `;

        return;
    }

    let nomor = 1;

    data.forEach(item=>{

        tbody.innerHTML += `

        <tr>

            <td>${nomor++}</td>

            <td>${item.nomorArsip || "-"}</td>

            <td>${item.kategori}</td>

            <td>${item.noAju || "-"}</td>

            <td>${item.nomorPendaftaran || "-"}</td>

            <td>${item.namaDokumen}</td>

            <td>${item.tanggal}</td>

            <td>

                <button
                class="btn btn-sm btn-primary"
                onclick="lihatFile(${item.id})">

                Lihat

                </button>

                <button
                class="btn btn-sm btn-success"
                onclick="downloadFile(${item.id})">

                Download

                </button>

                ${currentRole !== "viewer" ? `

                <button
                class="btn btn-sm btn-danger"
                onclick="hapusArsip(${item.id})">

                Hapus

                </button>

                ` : ""}

            </td>

        </tr>

        `;

    });

}

function cariArsip(){

    const keyword =
    document
    .getElementById(
        "searchInput"
    )
    .value
    .toLowerCase();

    const kategori =
    document
    .getElementById(
        "filterKategori"
    )
    .value;

    const hasil =
    semuaArsip.filter(item=>{

        const cocokKeyword =

        (item.noAju || "")
        .toLowerCase()
        .includes(keyword)

        ||

        (item.nomorPendaftaran || "")
        .toLowerCase()
        .includes(keyword)

        ||

        (item.namaDokumen || "")
        .toLowerCase()
        .includes(keyword)

        ||

        (item.kategori || "")
        .toLowerCase()
        .includes(keyword);

        const cocokKategori =

        kategori === ""

        ||

        item.kategori === kategori;

        return (
            cocokKeyword
            &&
            cocokKategori
        );

    });

    renderArsip(
        hasil
    );

}

function lihatFile(id){

    const tx =
    db.transaction(
        ["arsip"],
        "readonly"
    );

    const store =
    tx.objectStore(
        "arsip"
    );

    const req =
    store.get(id);

    req.onsuccess =
    function(){

        const arsip =
        req.result;

        document
        .getElementById(
            "previewFrame"
        )
        .src =
        arsip.fileData;

        const modal =
        new bootstrap.Modal(
            document.getElementById(
                "previewModal"
            )
        );

        modal.show();

    };

}

function downloadFile(id){

    const tx =
    db.transaction(
        ["arsip"],
        "readonly"
    );

    const store =
    tx.objectStore(
        "arsip"
    );

    const req =
    store.get(id);

    req.onsuccess =
    function(){

        const arsip =
        req.result;

        const a =
        document.createElement(
            "a"
        );

        a.href =
        arsip.fileData;

        a.download =
        arsip.fileName;

        a.click();

    };

}

function hapusArsip(id){

    if(
    localStorage.getItem("role")
    === "viewer"
    ){

    alert(
        "Viewer tidak memiliki akses menghapus arsip"
    );

    return;

    }

    if(
        !confirm(
            "Hapus arsip ini?"
        )
    ){
        return;
    }

    const tx =
    db.transaction(
        ["arsip"],
        "readwrite"
    );

    const store =
    tx.objectStore(
        "arsip"
    );

    store.delete(id);

    tx.oncomplete =
    function(){

        loadArsip();

    };

}

setTimeout(()=>{

    const search =
    document.getElementById(
        "searchInput"
    );

    const filter =
    document.getElementById(
        "filterKategori"
    );

    if(search){

        search.addEventListener(
            "keyup",
            cariArsip
        );

    }

    if(filter){

        filter.addEventListener(
            "change",
            cariArsip
        );

    }

},1000);

function exportExcel(){

    const dataExcel = semuaArsip.map(item=>({

        Kategori:
        item.kategori,

        NoAju:
        item.noAju || "",

        NomorPendaftaran:
        item.nomorPendaftaran || "",

        NamaDokumen:
        item.namaDokumen,

        Tanggal:
        item.tanggal,

        Keterangan:
        item.keterangan || "",

        NamaFile:
        item.fileName || ""

    }));

    const worksheet =
    XLSX.utils.json_to_sheet(
        dataExcel
    );

    const workbook =
    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Arsip"
    );

    XLSX.writeFile(
        workbook,
        "arsip.xlsx"
    );

}