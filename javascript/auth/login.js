import { URI } from "../uri.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    const loader = document.getElementById("login-loader");

    btnLogin.addEventListener("click", async (e) => {
        e.preventDefault();

        const varUsername = document.getElementById("username").value.trim();
        const varPassword = document.getElementById("password").value.trim();

        if (!varUsername || !varPassword) {
            M.toast({
                html: "Por favor, completa todos los campos",
                classes: 'red'
            });
            return;
        }

        loader.style.display = 'block';

        try {
            const response = await fetch(`${URI}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: varUsername,
                    password: varPassword
                })
            });

            loader.style.display = 'none';

            let data = {};
            try {
                data = await response.json();
            } catch (err) {
                // Si la respuesta no es JSON, muestra error genérico
                M.toast({
                    html: "Respuesta inesperada del servidor.",
                    classes: 'red'
                });
                return;
            }

            if (response.ok && data.success && data.user_id) {
                localStorage.setItem('user_id', data.user_id);
                M.toast({
                    html: "¡Inicio de sesión exitoso!",
                    classes: 'green'
                });
                setTimeout(() => {
                    location.href = 'index.html';
                }, 1000);
            } else {
                M.toast({
                    html: data.error || "Usuario o contraseña incorrectos.",
                    classes: 'red'
                });
            }
        } catch (error) {
            loader.style.display = 'none';
            M.toast({
                html: "No se puede conectar al servidor, intenta más tarde.",
                classes: 'red'
            });
        }
    });
});