import { URI } from "../uri.js";

document.addEventListener("DOMContentLoaded", () => {
    let btnLogin = document.getElementById("btnLogin");

    btnLogin.addEventListener("click", async () => {
        let varUsername = document.getElementById("username").value;
        let varPassword = document.getElementById("password").value;
        const loader = document.getElementById("login-loader");
        
        // Validación básica
        if (!varUsername.trim() || !varPassword.trim()) {
            M.toast({
                html: "Por favor, completa todos los campos",
                classes: 'red'
            });
            return;
        }
        
        loader.style.display = 'block';
        
        console.log(`Intentando conectar a: ${URI}/api/login`);
        
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

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            
            loader.style.display = 'none';

            if (data.user_id) {
                localStorage.setItem('user_id', data.user_id);
                M.toast({
                    html: data.mensaje,
                    classes: 'green'
                });
                location.href = 'index.html';
            } else {
                M.toast({
                    html: data.error || 'Error desconocido',
                    classes: 'red'
                });
            }
        } catch (error) {
            loader.style.display = 'none';
            console.error('Error details:', error);
            
            let errorMessage = 'Error de conexión';
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.';
            } else if (error.message.includes('HTTP error')) {
                errorMessage = `Error del servidor: ${error.message}`;
            }
            
            M.toast({
                html: errorMessage,
                classes: 'red'
            });
        }
    });
});