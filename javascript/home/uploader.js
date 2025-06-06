export function initUploader() {
    // Esperar a que el componente esté presente en el DOM
    const checkElements = () => {
        const imageInput = document.getElementById("imageInput");
        const fabUpload = document.getElementById("fab-upload");

        if (!imageInput || !fabUpload) {
            setTimeout(checkElements, 100); // Espera y reintenta
            return;
        }

        fabUpload.addEventListener("click", () => {
            imageInput.value = ""; // Limpiar selección previa
            imageInput.click();
        });

        imageInput.addEventListener("change", () => {
            const file = imageInput.files[0];
            if (!file) return;

            const userId = localStorage.getItem('user_id');
            if (!userId) {
                M.toast({html: "Debes iniciar sesión para subir imágenes", classes: "red"});
                return;
            }

            // Convertir imagen a base64 y enviar al backend
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64Image = event.target.result.split(',')[1];
                try {
                    const res = await fetch('http://localhost:5000/api/images', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            filedata: base64Image,
                            filename: file.name,
                            filetype: file.type
                        })
                    });
                    const data = await res.json();
                    if (res.ok && data && data.id) {
                        M.toast({html: "Imagen subida exitosamente", classes: "green"});
                        // Recargar galería si existe función
                        const galeria = document.querySelector("image-gallery");
                        if (galeria && typeof galeria.loadImages === "function") {
                            galeria.loadImages();
                        } else {
                            window.location.reload();
                        }
                    } else {
                        M.toast({html: "Error al subir imagen", classes: "red"});
                    }
                } catch (err) {
                    M.toast({html: "Error de red", classes: "red"});
                }
            };
            reader.readAsDataURL(file);
        });
    };
    checkElements();
}