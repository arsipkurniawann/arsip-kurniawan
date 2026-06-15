const username = localStorage.getItem("username");
const role = localStorage.getItem("role");

if (!username || !role) {
    alert("Silakan login terlebih dahulu");
    location.href = "../index.html";
}