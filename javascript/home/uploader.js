import { uploadImage } from "./services/api.js";

export function initUploader() {
    const imageInput = document.getElementById("imageInput");
    const fabUpload = document.getElementById("fab-upload");

    fabUpload.addEventListener("click", () => {
        imageInput.click(); // Cambiar al evento change: Línea 92
    });

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        const userId = localStorage.getItem('user_id');
        uploadImage(file, userId).then(data => {
            console.log('Imagen subida', data);
        });
    });
}