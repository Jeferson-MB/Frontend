document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    
    if (btnLogin) {
        btnLogin.addEventListener("click", async (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById("username");
            const passwordInput = document.getElementById("password");
            const loader = document.getElementById("login-loader");
            
            if (!usernameInput || !passwordInput) {
                M.toast({html: 'Error: Campos de login no encontrados', classes: 'red'});
                return;
            }
            
            const varUsername = usernameInput.value.trim();
            const varPassword = passwordInput.value.trim();
            
            // Validación básica
            if (!varUsername || !varPassword) {
                M.toast({html: 'Por favor llena todos los campos', classes: 'orange'});
                return;
            }
            
            if (varUsername.length < 3) {
                M.toast({html: 'El usuario debe tener al menos 3 caracteres', classes: 'orange'});
                return;
            }
            
            if (varPassword.length < 4) {
                M.toast({html: 'La contraseña debe tener al menos 4 caracteres', classes: 'orange'});
                return;
            }
            
            // Deshabilitar botón y mostrar loader
            btnLogin.disabled = true;
            if (loader) loader.style.display = 'block';

            try {
                // Simular delay mínimo para UX
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const response = await fetch('http://127.0.0.1:5000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: varUsername,
                        password: varPassword
                    })
                });

                const data = await response.json();
                
                if (response.ok && data.user_id) {
                    localStorage.setItem('user_id', data.user_id);
                    M.toast({
                        html: data.mensaje || 'Login exitoso',
                        classes: 'green'
                    });
                    
                    // Delay para que el usuario vea el mensaje
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                    
                } else {
                    M.toast({
                        html: data.error || 'Credenciales incorrectas',
                        classes: 'red'
                    });
                }
                
            } catch (error) {
                console.error('Error de login:', error);
                M.toast({
                    html: "Error de conexión. Verifica que el servidor esté funcionando.",
                    classes: 'red'
                });
            } finally {
                // Rehabilitar botón y ocultar loader
                btnLogin.disabled = false;
                if (loader) loader.style.display = 'none';
            }
        });
        
        // Permitir login con Enter
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !btnLogin.disabled) {
                btnLogin.click();
            }
        });
    }
});
