class ImageGallery extends HTMLElement {
    constructor() {
        super();
        this.onlyMine = this.getAttribute('only-mine') === 'true';
        this.innerHTML = `
            <div id="gallery-container" class="row" style="margin-top:30px;"></div>
        `;
    }

    connectedCallback() {
        this.loadImages(this.onlyMine);
    }

    async loadImages(onlyMine = false) {
        const container = this.querySelector("#gallery-container");
        container.innerHTML = "<div class='center-align'><span class='blue-text'>Cargando galería...</span></div>";
        let users = [];
        let images = [];
        let comments = [];
        let userId = Number(localStorage.getItem("user_id"));
        try {
            users = await fetch('https://backend-ilaq.onrender.com/api/users').then(r => r.json());
        } catch {
            users = [];
        }
        try {
            images = await fetch('https://backend-ilaq.onrender.com/api/images').then(r => r.json());
            if (!Array.isArray(images)) images = [];
        } catch {
            container.innerHTML = "<div class='center-align red-text'>No se pudo cargar la galería.</div>";
            return;
        }
        try {
            comments = await fetch('https://backend-ilaq.onrender.com/api/comments').then(r => r.json());
            if (!Array.isArray(comments)) comments = [];
        } catch {
            comments = [];
        }

        container.innerHTML = "";

        images.forEach(img => {
            const isMine = Number(img.user_id) === userId;
            if (onlyMine && !isMine) return;
            if (!onlyMine && isMine) return;

            const uploader = users.find(u => Number(u.id) === Number(img.user_id));
            let uploaderName = uploader ? (Number(uploader.id) === userId ? "Tú" : uploader.username) : "Desconocido";
            let uploaderProfileLink = uploader
                ? `<a href="/frontend/perfil.html?user_id=${uploader.id}" style="color:#1565c0; font-weight:bold; text-decoration:underline; cursor:pointer;" class="uploader-link" data-userid="${uploader.id}">${uploaderName}</a>`
                : uploaderName;

            const imgComments = comments.filter(c => Number(c.image_id) === Number(img.id));
            let commentsHtml = imgComments.map(c => {
                const commenter = users.find(u => Number(u.id) === Number(c.user_id));
                const commenterName = commenter ? (Number(commenter.id) === userId ? "Tú" : commenter.username) : "Desconocido";
                return `
                    <div class="comment" style="font-size:0.95em; margin-bottom: 8px;">
                        <b style="color:#1565c0;">${commenterName}:</b> ${c.text}
                    </div>
                `;
            }).join("");

            const card = document.createElement('div');
            card.className = 'col s12 m6 l4';
            card.innerHTML = `
                <div class="card hoverable z-depth-3" style="border-radius: 20px; overflow: hidden;">
                    <div class="card-image" style="border-radius: 20px 20px 0 0; overflow: hidden; position:relative;">
                        <img class="materialboxed" src="data:image/jpg;base64,${img.filedata}" alt="${img.filename}" style="border-radius: 20px 20px 0 0; width:100%; height:250px; object-fit:cover;">
                        <a class='btn-floating halfway-fab waves-effect waves-light blue like-btn' data-imageid='${img.id}' style="position:absolute;right:20px;bottom:20px;">
                            <i class='material-icons heart' id='heart-${img.id}'>favorite_border</i>
                            <span class="like-count" id="like-count-${img.id}" style="color:white; margin-left:10px; font-weight:bold; font-size:1rem;"></span>
                        </a>
                    </div>
                    <div class="card-content" style="border-radius: 0 0 20px 20px;">
                        <span class="card-title" style="font-size:1.2rem;">Subido por: ${uploaderProfileLink}</span>
                        <div class="comments-section">${commentsHtml}</div>
                        <div class="comment-section row" style="margin-top: 10px;">
                            <div class="input-field" style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 30px; padding: 0 10px;">
                                <input id="comment-${img.id}" type="text" placeholder="Envía un mensaje" style="border: none; box-shadow: none; margin: 0; flex: 1;">
                                <a data-imageid="${img.id}" class="btn-flat waves-effect waves-grey send-comment-btn" style="min-width: auto; padding: 0;">
                                    <i class="material-icons">send</i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);

            // Cargar likes al renderizar la card
            fetch(`https://backend-ilaq.onrender.com/api/images/${img.id}/likes`)
                .then(r => r.json())
                .then(data => {
                    const likeCountEl = document.getElementById(`like-count-${img.id}`);
                    if (likeCountEl) likeCountEl.textContent = data.count || 0;
                });
        });

        if (window.M && M.Materialbox) {
            M.Materialbox.init(this.querySelectorAll('.materialboxed'));
        }

        // EVENT LISTENER PARA ENVIAR COMENTARIOS
        container.querySelectorAll('.send-comment-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const imageId = btn.getAttribute('data-imageid');
                const input = container.querySelector(`#comment-${imageId}`);
                const text = input.value.trim();
                if (!text) return;

                const userId = Number(localStorage.getItem("user_id"));
                try {
                    const res = await fetch(`https://backend-ilaq.onrender.com/api/images/${imageId}/comments`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            text: text
                        })
                    });

                    if (res.ok) {
                        input.value = "";
                        this.loadImages(onlyMine);
                    } else {
                        alert('Error al enviar comentario.');
                    }
                } catch {
                    alert("Error de red al enviar comentario.");
                }
            });
        });

        // Permitir enviar comentario con Enter
        container.querySelectorAll('input[id^="comment-"]').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const imageId = input.id.split('-')[1];
                    container.querySelector(`a.send-comment-btn[data-imageid="${imageId}"]`).click();
                }
            });
        });

        // EVENT LISTENER para ir al perfil del usuario al hacer click en su nombre
        container.querySelectorAll('.uploader-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const userId = link.getAttribute('data-userid');
                window.location.href = `/frontend/profile.html?user_id=${userId}`;
            });
        });

        // EVENT LISTENER para dar like
        container.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const imageId = btn.getAttribute('data-imageid');
                const heartIcon = btn.querySelector('.heart');
                const likeCountEl = document.getElementById(`like-count-${imageId}`);
                const userId = Number(localStorage.getItem("user_id"));

                // Enviar like al backend con user_id
                const res = await fetch(`https://backend-ilaq.onrender.com/api/images/${imageId}/likes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId }),
                });

                if (res.ok) {
                    const data = await res.json();
                    if (likeCountEl) likeCountEl.textContent = data.count || 0;
                    heartIcon.textContent = 'favorite';
                    heartIcon.classList.add('liked-animate');
                    setTimeout(() => {
                        heartIcon.classList.remove('liked-animate');
                    }, 600);
                } else {
                    const errMsg = await res.text();
                    alert("Error al dar like: " + errMsg);
                }
            });
        });
    }
}

if (!customElements.get('image-gallery')) {
    customElements.define('image-gallery', ImageGallery);
}