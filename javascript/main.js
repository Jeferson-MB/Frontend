document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    if (btnLogin) {
        btnLogin.addEventListener("click", () => {
            let varUsername = document.getElementById("username").value;
            let varPassword = document.getElementById("password").value;
            const loader = document.getElementById("login-loader");

            if (loader) loader.style.display = 'block';

            setTimeout(() => {
                fetch('http://127.0.0.1:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: varUsername,
                        password: varPassword
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (loader) loader.style.display = 'none';
                    if (data.user_id) {
                        localStorage.setItem('user_id', data.user_id);
                        M.toast({ html: data.mensaje, classes: 'green' });
                        location.href = 'index.html';
                    } else {
                        M.toast({ html: data.error, classes: 'red' });
                    }
                })
            }, 800);
        });
    }
});


