class ImageGallery extends HTMLElement {
    constructor() {
        super();
        this.onlyMine = this.getAttribute('only-mine') === 'true';
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .gallery-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 24px;
                    justify-content: center;
                }
                .card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
                    width: 290px;
                    margin-bottom: 16px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .card-image {
                    width: 100%;
                    height: 230px;
                    background: #eee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                .card-image img {
                    max-width: 100%;
                    max-height: 100%;
                    display: block;
                    margin: auto;
                }
                .card-content {
                    padding: 10px 18px;
                    min-height: 40px;
                }
                .card-title {
                    font-size: 1rem;
                    color: #1a237e;
                    font-weight: bold;
                }
                .uploader-link {
                    color: #1565c0;
                    text-decoration: none;
                }
            </style>
            <div class="gallery-row" id="gallery"></div>
        `;
    }

    connectedCallback() {
        this.loadData();
    }

    async loadData() {
        const myUserId = Number(localStorage.getItem("user_id"));
        if (!myUserId) {
            window.location.href = './login.html';
            return;
        }

        // Cargar usuarios
        const users = await fetch('http://127.0.0.1:5000/api/users').then(r => r.json());

        // Cargar imágenes (con base64)
        const images = await fetch('https://backend-ilaq.onrender.com/api/images').then(r => r.json());

        this.renderGallery(users, images, myUserId);
    }

    renderGallery(users, images, myUserId) {
        const container = this.shadowRoot.getElementById('gallery');
        container.innerHTML = "";

        images.forEach(img => {
            const isMine = Number(img.user_id) === myUserId;
            if (this.onlyMine && !isMine) return;
            if (!this.onlyMine && isMine) return;

            // Encuentra el uploader
            const uploader = users.find(u => Number(u.id) === Number(img.user_id));
            let uploaderHTML = '';
            if (uploader) {
                if (Number(uploader.id) === myUserId) {
                    uploaderHTML = '<strong>Tú</strong>';
                } else {
                    uploaderHTML = `<a class="uploader-link" href="profile.html?user_id=${uploader.id}"><strong>${uploader.username}</strong></a>`;
                }
            } else {
                uploaderHTML = '<strong>Desconocido</strong>';
            }

            // Usa la imagen en base64
            const imgSrc = `data:image/jpeg;base64,${img.filedata}`;

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class='card-image'>
                    <img src='${imgSrc}' alt='Imagen subida' />
                </div>
                <div class='card-content'>
                    <span class='card-title'>Subido por: ${uploaderHTML}</span>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

customElements.define('image-gallery', ImageGallery);