function login(){

    const username =
    document.getElementById(
        "username"
    ).value.trim();

    const password =
    document.getElementById(
        "password"
    ).value.trim();

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

        const users =
        request.result;

        const user =
        users.find(u =>

            u.username === username
            &&
            u.password === password

        );

        if(user){

            localStorage.setItem(
                "role",
                user.role
            );

            localStorage.setItem(
                "username",
                user.username
            );

            location.href =
            "pages/dashboard.html";

        }

        else{

            alert(
                "Username atau Password Salah"
            );

        }

    };

}