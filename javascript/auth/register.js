import { URI } from "../uri.js";

document.addEventListener("DOMContentLoaded", () => {
    
    const btnRegister = document.getElementById("btnRegister");
    const profilePhotoInput = document.getElementById("profile-photo");
    const photoPreview = document.getElementById("photo-preview");
    
    // Vista previa de la imagen seleccionada
    profilePhotoInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            photoPreview.style.display = 'none';
        }
    });

    // Función para validar los datos del formulario
    function validateForm() {
        const username = document.getElementById("reg-username").value.trim();
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("reg-confirm-password").value;
        const profilePhoto = document.getElementById("profile-photo").files[0];

        // Validar campos vacíos
        if (!username) {
            M.toast({html: "El nombre de usuario es requerido", classes: 'red'});
            return false;
        }

        if (username.length < 3) {
            M.toast({html: "El nombre de usuario debe tener al menos 3 caracteres", classes: 'red'});
            return false;
        }

        if (!password) {
            M.toast({html: "La contraseña es requerida", classes: 'red'});
            return false;
        }

        if (password.length < 6) {
            M.toast({html: "La contraseña debe tener al menos 6 caracteres", classes: 'red'});
            return false;
        }

        if (password !== confirmPassword) {
            M.toast({html: "Las contraseñas no coinciden", classes: 'red'});
            return false;
        }

        if (!profilePhoto) {
            M.toast({html: "Debes seleccionar una foto de perfil", classes: 'red'});
            return false;
        }

        // Validar tipo de archivo
        if (!profilePhoto.type.startsWith('image/')) {
            M.toast({html: "El archivo debe ser una imagen", classes: 'red'});
            return false;
        }

        // Validar tamaño de archivo (máximo 5MB)
        if (profilePhoto.size > 5 * 1024 * 1024) {
            M.toast({html: "La imagen no debe superar los 5MB", classes: 'red'});
            return false;
        }

        return true;
    }

    // Manejar el evento de registro
    btnRegister.addEventListener("click", async () => {
        if (!validateForm()) return;

        const username = document.getElementById("reg-username").value.trim();
        const password = document.getElementById("reg-password").value;
        const profilePhoto = document.getElementById("profile-photo").files[0];
        const loader = document.getElementById("login-loader");
        
        // Convertir imagen a base64
        const reader = new FileReader();
        reader.onload = async () => {
            const base64Image = reader.result.split(',')[1]; // Remover el prefijo data:image/...;base64,
            
            loader.style.display = 'block'; // Muestra el loader

            try {
                console.log(`Enviando registro a: ${URI}/api/register`);
                
                const response = await fetch(`${URI}/api/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        profile_photo: base64Image,
                        photo_type: profilePhoto.type
                    })
                });

                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Response data:', data);
                
                loader.style.display = 'none'; // Oculta el loader

                if (data.success) {
                    M.toast({
                        html: data.message || 'Usuario registrado exitosamente',
                        classes: 'green'
                    });
                    
                    // Redireccionar al login después de 2 segundos
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    M.toast({
                        html: data.error || 'Error al registrar usuario',
                        classes: 'red'
                    });
                }
            } catch (error) {
                loader.style.display = 'none'; // Oculta el loader
                console.error('Error:', error);
                
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
        };
        
        reader.readAsDataURL(profilePhoto);
    });
});