class ImageUploader extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = /*html*/`
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

            // Convertir a base64
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = e.target.result.split(',')[1];
                const user_id = localStorage.getItem('user_id');
                const filename = file.name;

                // Enviar la imagen al backend
                try {
                    const res = await fetch('http://localhost:5000/api/images', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            filedata: base64,
                            filename,
                            user_id
                        })
                    });
                    if (res.ok) {
                        // Recarga para mostrar la nueva imagen
                        window.location.reload();
                    } else {
                        alert('Error al subir la imagen');
                    }
                } catch (err) {
                    alert('No se pudo conectar al servidor');
                }
            };
            reader.readAsDataURL(file);
        });
    }
}
customElements.define('image-uploader', ImageUploader);