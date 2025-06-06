class ImageGallery extends HTMLElement {
    connectedCallback() {
        const onlyMine = this.getAttribute('only-mine') === 'true';
        this.innerHTML = `<div class="row" id="gallery"></div>`;
        this.loadImages(onlyMine);
    }

    async loadImages(onlyMine = false) {
        const userId = Number(localStorage.getItem("user_id"));
        const container = this.querySelector("#gallery");

        if (!userId) {
            container.innerHTML = "<div class='white-text center-align' style='margin:24px;'>Debes iniciar sesión para ver la galería.</div>";
            return;
        }

        // Trae las imágenes y los usuarios
        const [imagesRes, usersRes] = await Promise.all([
            fetch("http://localhost:5000/api/images"),
            fetch("http://localhost:5000/api/users")
        ]);

        const images = await imagesRes.json();
        const users = await usersRes.json();

        // Filtra imágenes según modo
        const imagesToShow = onlyMine
            ? images.filter(img => Number(img.user_id) === userId)
            : images.filter(img => Number(img.user_id) !== userId);

        if (!imagesToShow.length) {
            container.innerHTML = `<div class='white-text center-align' style='margin:24px;'>${onlyMine ? "No tienes fotos subidas." : "No hay imágenes en la galería general."}</div>`;
            return;
        }

        imagesToShow.forEach(img => {
            const uploader = users.find(u => Number(u.id) === Number(img.user_id));
            const uploaderName = uploader
                ? (Number(uploader.id) === userId ? 'Tú' : uploader.username)
                : "<strong>Desconocido</strong>";

            // Comentarios
            let commentsHtml = "";
            if (Array.isArray(img.comments) && img.comments.length) {
                commentsHtml = img.comments.map(c => {
                    const commenter = users.find(u => Number(u.id) === Number(c.user_id));
                    const commenterName = commenter
                        ? (Number(commenter.id) === userId ? 'Tú' : commenter.username)
                        : "Anónimo";
                    return `<p><strong>${commenterName}</strong>: ${c.text}</p>`;
                }).join('');
            } else {
                commentsHtml = "<p>Sin comentarios aun</p>";
            }

            const card = document.createElement("div");
            card.className = "col s12 m6 l4";
            card.innerHTML = `
                <div class="card hoverable z-depth-3" style="border-radius: 20px; overflow: hidden;">
                    <div class="card-image" style="border-radius: 20px 20px 0 0; overflow: hidden; position:relative;">
                        <img class="materialboxed" src="data:image/jpg;base64,${img.filedata}" alt="${img.filename}" style="border-radius: 20px 20px 0 0; width:100%; height:250px; object-fit:cover;">
                        <a class='btn-floating halfway-fab waves-effect waves-light blue like-btn' data-imageid='${img.id}' style="position:absolute;right:20px;bottom:20px;">
                            <i class='material-icons'>favorite_border</i>
                        </a>
                    </div>
                    <div class="card-content" style="border-radius: 0 0 20px 20px;">
                        <span class="card-title" style="font-size:1.2rem;">Subido por: ${uploaderName}</span>
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
                // Enviar al backend
                const res = await fetch(`http://localhost:5000/api/images/${imageId}/comments`, {
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
                    // Recargar la galería para mostrar el comentario nuevo
                    this.loadImages(onlyMine);
                } else {
                    alert('Error al enviar comentario.');
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
    }
}
customElements.define('image-gallery', ImageGallery);