class ImageUploader extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="fixed-action-btn" style="z-index: 999;">
            <a id="fab-upload" class="btn-floating btn-large blue" title="Subir imagen">
                <i class="material-icons">add_a_photo</i>
            </a>
        </div>
        <input type="file" id="imageInput" accept="image/*" style="display:none;">
        `;
    }

    connectedCallback() {
        const fab = this.querySelector('#fab-upload');
        const fileInput = this.querySelector('#imageInput');

        fab.addEventListener('click', () => {
            fileInput.value = '';
            fileInput.click();
        });

        fileInput.addEventListener('change', async () => {
            const file = fileInput.files[0];
            if (!file) return;

            // SUBIR A CLOUDINARY
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', 'Jeferson'); // ← Tu upload_preset
            const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/Jeferson/image/upload'; // ← Tu cloud_name

            let urlCloudinary;
            try {
                const res = await fetch(cloudinaryUrl, {
                    method: 'POST',
                    body: data
                });
                const json = await res.json();
                urlCloudinary = json.secure_url;
                if (!urlCloudinary) throw new Error('No se obtuvo URL de Cloudinary');
            } catch (err) {
                alert('Error al subir a Cloudinary');
                return;
            }

            // ENVIAR URL AL BACKEND
            const user_id = localStorage.getItem('user_id');
            const filename = file.name;

            try {
                const res = await fetch('https://backend-ilaq.onrender.com/api/images', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image_url: urlCloudinary,
                        filename,
                        user_id
                    })
                });
                if (res.ok) {
                    window.location.reload();
                } else {
                    alert('Error al subir la imagen al backend');
                }
            } catch (err) {
                alert('No se pudo conectar al servidor');
            }
        });
    }
}
if (!customElements.get('image-uploader')) {
    customElements.define('image-uploader', ImageUploader);
}