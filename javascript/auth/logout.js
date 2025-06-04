document.addEventListener("DOMContentLoaded", () => {
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("user_id");
            window.location.href = '/frontend/login.html';
        });
    }
});

