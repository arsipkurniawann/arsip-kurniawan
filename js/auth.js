/*
====================================================
Arsip Kurniawan v1.0
Authentication Module
====================================================
*/

const LOGIN_TIMEOUT = 30000;

/*
====================================================
Login
====================================================
*/

async function login() {

    const username =
        document
            .getElementById("username")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value
            .trim();

    if (!username || !password) {

        alert("Username dan password wajib diisi.");

        return;

    }

    const loginButton =
        document.querySelector(
            'button[onclick="login()"]'
        );

    const originalText =
        loginButton.innerHTML;

    loginButton.disabled = true;
    loginButton.innerHTML = "Memproses...";

    const controller =
        new AbortController();

    const timeout =
        setTimeout(() => {

            controller.abort();

        }, LOGIN_TIMEOUT);

    try {

        const response =
            await fetch(CONFIG.API_URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    action: "login",

                    username,

                    password

                }),

                signal: controller.signal

            });

        clearTimeout(timeout);

        if (!response.ok) {

            throw new Error(
                "Server tidak merespons."
            );

        }

        const result =
            await response.json();

        if (!result.success) {

            alert(
                result.message ||
                "Login gagal."
            );

            return;

        }

        localStorage.setItem(
            "isLogin",
            "true"
        );

        localStorage.setItem(
            "username",
            result.username
        );

        localStorage.setItem(
            "role",
            result.role
        );

        localStorage.setItem(
            "loginTime",
            new Date().toISOString()
        );

        location.href =
            "pages/dashboard.html";

    }

    catch (err) {

        console.error(err);

        if (err.name === "AbortError") {

            alert(
                "Request timeout."
            );

        }

        else {

            alert(
                "Tidak dapat terhubung ke server."
            );

        }

    }

    finally {

        clearTimeout(timeout);

        loginButton.disabled = false;

        loginButton.innerHTML =
            originalText;

    }

}

/*
====================================================
Logout
====================================================
*/

function logout() {

    localStorage.removeItem("isLogin");

    localStorage.removeItem("username");

    localStorage.removeItem("role");

    localStorage.removeItem("loginTime");

    location.href = "../index.html";

}

/*
====================================================
Session
====================================================
*/

function isLoggedIn() {

    return (
        localStorage.getItem("isLogin")
        ===
        "true"
    );

}

function getCurrentUser() {

    return {

        username:
            localStorage.getItem(
                "username"
            ),

        role:
            localStorage.getItem(
                "role"
            )

    };

}

/*
====================================================
Console
====================================================
*/

console.log(

    CONFIG.APP_NAME +

    " Auth Module v" +

    CONFIG.VERSION +

    " Loaded"

);