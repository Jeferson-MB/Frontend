document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementById("btn-logout").addEventListener("click", () => {
        localStorage.removeItem("user_id");
        window.location.href = '/frontend/login.html';
    });
});