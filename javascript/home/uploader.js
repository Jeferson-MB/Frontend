import { uploadImage } from "./services/api.js";

export function initUploader(onUploadComplete) {
    const imageInput = document.getElementById("imageInput");
    const fabUpload = document.getElementById("fab-upload");

    if (!imageInput || !fabUpload) {
        console.warn('Elementos de upload no encontrados');
        return;
    }

    fabUpload.addEventListener("click", () => {
        imageInput.click();
    });

    imageInput.addEventListener("change", async () => {
        const file = imageInput.files[0];
        if (!file) return;

        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            M.toast({html: 'Solo se permiten imágenes (JPG, PNG, GIF, WebP)', classes: 'red'});
            imageInput.value = '';
            return;
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            M.toast({html: 'La imagen es muy grande. Máximo 5MB', classes: 'red'});
            imageInput.value = '';
            return;
        }

        const userId = localStorage.getItem('user_id');
        if (!userId) {
            M.toast({html: 'Error: Usuario no identificado', classes: 'red'});
            return;
        }

        try {
            // Mostrar toast de carga
            M.toast({html: 'Subiendo imagen...', classes: 'blue'});
            
            const data = await uploadImage(file, userId);
            console.log('Imagen subida exitosamente:', data);
            
            M.toast({html: 'Imagen subida correctamente', classes: 'green'});
            
            // Limpiar input
            imageInput.value = '';
            
            // Callback para recargar galería si se proporciona
            if (typeof onUploadComplete === 'function') {
                onUploadComplete();
            }
            
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            M.toast({html: 'Error al subir la imagen. Intenta de nuevo.', classes: 'red'});
            imageInput.value = '';
        }
    });
}