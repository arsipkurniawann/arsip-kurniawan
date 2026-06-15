document
.getElementById("kategori")
.addEventListener(
    "change",
    function(){

        const kategori =
        this.value;

        if(
            kategori === "Lainnya"
        ){

            document
            .getElementById(
                "ajuSection"
            )
            .style.display =
            "none";

        }

        else{

            document
            .getElementById(
                "ajuSection"
            )
            .style.display =
            "block";

        }

    }
);

function simpanArsip(){

    const kategori =
    document.getElementById(
        "kategori"
    ).value;

    const noAju =
    document.getElementById(
        "noAju"
    ).value;

    const nomorPendaftaran =
    document.getElementById(
        "nomorPendaftaran"
    ).value;

    const namaDokumen =
    document.getElementById(
        "namaDokumen"
    ).value;

    const tanggal =
    document.getElementById(
        "tanggal"
    ).value;

    const keterangan =
    document.getElementById(
        "keterangan"
    ).value;

    const file =
    document.getElementById(
        "fileArsip"
    ).files[0];

    if(!namaDokumen){

        alert(
            "Nama Dokumen wajib diisi"
        );

        return;
    }

    if(!file){

        alert(
            "File wajib dipilih"
        );

        return;
    }

    const reader =
    new FileReader();

    reader.onload =
    function(){

        const tahun =
        new Date()
        .getFullYear();

        const nomorArsip =
        "AK-"
        +
        tahun
        +
        "-"
        +
        Date.now();

        const arsip = {

            kategori,

            noAju,

            nomorPendaftaran,

            namaDokumen,

            tanggal,

            keterangan,

            fileName:file.name,

            fileType:file.type,

            fileData:reader.result,

            createdAt:
            new Date()

        };

        const tx =
        db.transaction(
            ["arsip"],
            "readwrite"
        );

        const store =
        tx.objectStore(
            "arsip"
        );

        store.add(
            arsip
        );

        tx.oncomplete =
        function(){

            alert(
                "Arsip berhasil disimpan"
            );

            location.href =
            "arsip.html";

        };

    };

    reader.readAsDataURL(
        file
    );

}