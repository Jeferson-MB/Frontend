import { URI } from "../uri.js";
import { fetchComments, fetchImages } from "./services/api.js";

export async function loadGallery(users, onlyMine = false) {
    const userId = parseInt(localStorage.getItem("user_id"));
    const container = document.getElementById("gallery");
    const loader = document.getElementById("loader");

    if (loader) loader.style.display = 'block';
    container.innerHTML = '';

    // Trae todas las imágenes
    const images = await fetchImages();

    // Simula almacenamiento local de likes por imagen
    let likesStore = JSON.parse(localStorage.getItem("my_likes") || "{}");
    // Simula conteo de likes por imagen
    let likesCountStore = JSON.parse(localStorage.getItem("likes_count") || "{}");

    images.forEach(img => {
        // Filtra según el usuario si onlyMine está activo
        const isMine = parseInt(img.user_id) === userId;
        if (onlyMine && !isMine) return;
        if (!onlyMine && isMine) return;

        // Datos del uploader
        const uploader = users.find(u => u.id == img.user_id);
        const uploaderName = uploader ? (uploader.id === userId ? 'Tú' : uploader.username) : 'Desconocido';

        // Comentarios
        const commentsHtml = (img.comments || []).map(c => {
            const commenter = users.find(u => u.id === c.user_id);
            const commenterName = commenter ? (commenter.id === userId ? 'Tú' : commenter.username) : 'Anónimo';
            return `<p><strong>${commenterName}</strong>: ${c.text}</p>`;
        }).join('');

        // Likes (simulado, real sería con backend)
        let liked = !!likesStore[img.id];
        let likesCount = likesCountStore[img.id] || 0;

        // Tarjeta con botón de like flotante (igual que en galería de usuario)
        const card = document.createElement('div');
        card.className = 'col s12 m6 l4';
        card.innerHTML = `
            <div class="card hoverable z-depth-3" style="border-radius: 20px; overflow: hidden;">
                <div class="card-image" style="border-radius: 20px 20px 0 0; overflow: hidden; position:relative;">
                    <img class="materialboxed" src="data:image/jpg;base64,${img.filedata}" alt="${img.filename}" style="border-radius: 20px 20px 0 0; width:100%; height:250px; object-fit:cover;">
                    <div class="like-wrapper" style="position:absolute;right:20px;bottom:20px;display:flex;flex-direction:column;align-items:center;z-index:2;">
                        <span class="like-count" style="color:white; background:#1565c0; border-radius:12px; min-width:26px; padding:2px 8px; font-weight:bold; margin-bottom:2px; box-shadow:0 2px 4px rgba(0,0,0,.12);font-size:0.95rem; transition:all .2s;">${likesCount}</span>
                        <a class='btn-floating halfway-fab waves-effect waves-light blue like-btn' data-imageid='${img.id}' style="box-shadow: 0 4px 12px #1976d2a3;">
                            <i class='material-icons${liked ? ' liked' : ''}' style="transition:.22s cubic-bezier(.4,2,.6,1); font-size:2.1rem; color:${liked ? '#fff' : ''};">${liked ? 'favorite' : 'favorite_border'}</i>
                        </a>
                    </div>
                </div>
                <div class="card-content" style="border-radius: 0 0 20px 20px;">
                    <span class="card-title" style="font-size:1.2rem;">Subido por: <a class="profile-link" href="profile.html?user_id=${uploader ? uploader.id : ''}"><strong>${uploaderName}</strong></a></span>
                    ${commentsHtml || '<p>Sin comentarios aun</p>'}
                    <div class="comment-section row" style="margin-top: 10px;">
                        <div class="input-field" style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 30px; padding: 0 10px;">
                            <input id="comment-${img.id}" type="text" placeholder="Envía un mensaje" style="border: none; box-shadow: none; margin: 0; flex: 1; background: transparent;">
                            <a data-imageid="${img.id}" class="btn-flat waves-effect waves-grey" style="min-width: auto; padding: 0;">
                                <i class="material-icons">send</i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Inicializa Materialbox para imágenes
    if (window.M && M.Materialbox) {
        M.Materialbox.init(container.querySelectorAll('.materialboxed'));
    }

    // Evento para agregar comentario
    container.querySelectorAll('.comment-section a').forEach(btn => {
        btn.addEventListener('click', async () => {
            const imageId = btn.getAttribute('data-imageid');
            const input = document.getElementById(`comment-${imageId}`);
            const text = input.value.trim();
            if (!text) return;
            await fetchComments(imageId, userId, text);
            input.value = '';
            loadGallery(users, onlyMine); // Recarga la galería para ver el nuevo comentario
        });
    });

    // Evento de like animado con contador
    container.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const imgId = btn.getAttribute('data-imageid');
            const icon = btn.querySelector('i');
            const countElem = btn.parentElement.querySelector('.like-count');
            let likesStore = JSON.parse(localStorage.getItem("my_likes") || "{}");
            let likesCountStore = JSON.parse(localStorage.getItem("likes_count") || "{}");
            let liked = !!likesStore[imgId];
            let count = likesCountStore[imgId] || 0;

            if (!liked) {
                // Animación "pop" al dar like
                icon.textContent = 'favorite';
                icon.classList.add('liked');
                icon.style.color = "#fff";
                btn.classList.add("pulse");
                btn.style.background = "#e53935";
                // animación rápida
                icon.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.25)' },
                    { transform: 'scale(1)' }
                ], { duration: 320, easing: "cubic-bezier(.4,2,.6,1)" });
                // Actualiza contador
                count++;
                likesStore[imgId] = true;
                likesCountStore[imgId] = count;
            } else {
                icon.textContent = 'favorite_border';
                icon.classList.remove('liked');
                icon.style.color = "";
                btn.classList.remove("pulse");
                btn.style.background = "";
                // Animación rápida
                icon.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(0.85)' },
                    { transform: 'scale(1)' }
                ], { duration: 260, easing: "cubic-bezier(.4,2,.6,1)" });
                // Actualiza contador
                count = Math.max(0, count - 1);
                delete likesStore[imgId];
                likesCountStore[imgId] = count;
            }

            countElem.textContent = count;
            localStorage.setItem("my_likes", JSON.stringify(likesStore));
            localStorage.setItem("likes_count", JSON.stringify(likesCountStore));
        });
    });

    if (loader) loader.style.display = 'none';
}