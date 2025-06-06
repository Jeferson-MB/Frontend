import { fetchImages } from "./services/api.js";

export async function loadGallery(users, onlyMine = false) {
    const userId = parseInt(localStorage.getItem("user_id"));
    const container = document.getElementById("gallery");
    const loader = document.getElementById("loader");

    if (loader) loader.style.display = 'block';
    container.innerHTML = '';

    let images = await fetchImages();

    // Elimina duplicados
    const seen = new Set();
    images = images.filter(img => {
        if (seen.has(img.id)) return false;
        seen.add(img.id);
        return true;
    });

    // Filtro correcto según vista activa
    let imagesToShow = onlyMine
        ? images.filter(img => parseInt(img.user_id) === userId)
        : images.filter(img => parseInt(img.user_id) !== userId);

    let likedImages = JSON.parse(localStorage.getItem('liked_images') || '[]');

    // Mensaje si no hay imágenes
    if (imagesToShow.length === 0) {
        container.innerHTML = `<div class='center-align' style='margin:24px;color:#222;'>${
            onlyMine ? "No tienes fotos subidas." : "No hay imágenes en la galería general."
        }</div>`;
        if (loader) loader.style.display = 'none';
        return;
    }

    imagesToShow.forEach(img => {
        const uploader = users.find(u => u.id == img.user_id);
        const uploaderName = uploader ? (parseInt(uploader.id) === userId ? 'Tú' : uploader.username) : 'Desconocido';

        const commentsHtml = (img.comments || []).map(c => {
            const commenter = users.find(u => u.id === c.user_id);
            const commenterName = commenter ? (parseInt(commenter.id) === userId ? 'Tú' : commenter.username) : 'Anónimo';
            return `<p><strong>${commenterName}</strong>: ${c.text}</p>`;
        }).join('');

        const isLiked = likedImages.includes(img.id);

        const card = document.createElement('div');
        card.className = 'col s12 m6 l4';
        card.innerHTML = `
            <div class='card hoverable z-depth-3'>
                <div class='card-image'>
                    <img class='materialboxed' src='data:image/jpg;base64,${img.filedata}' />
                    <a class='btn-floating halfway-fab waves-effect waves-light blue like-btn' data-imageid='${img.id}'>
                        <i class='material-icons ${isLiked ? "Liked" : ""}'>${isLiked ? "favorite" : "favorite_border"}</i>
                    </a>
                </div>
                <div class='card-content'>
                    <span class='card-title'>Subido por: <a class="profile-link" href="profile.html?user_id=${uploader ? uploader.id : ''}"><strong>${uploaderName}</strong></a></span>
                    ${commentsHtml || '<p>Sin comentarios aun</p>'}
                    <div class='comment-section row'>
                        <div class="input-field" style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 30px; padding: 0 10px;">
                        <input id="comment-${img.id}" type="text" placeholder="Envía un mensaje" style="border: none; box-shadow: none; margin: 0; flex: 1;">
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

    if (window.M && window.M.Materialbox) {
        M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    }
    if (loader) loader.style.display = 'none';

    // Likes persistente (localStorage)
    container.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            const imageId = Number(btn.getAttribute('data-imageid'));
            let likedImages = JSON.parse(localStorage.getItem('liked_images') || '[]');
            if (likedImages.includes(imageId)) {
                likedImages = likedImages.filter(id => id !== imageId);
                icon.textContent = 'favorite_border';
                icon.classList.remove('Liked');
            } else {
                likedImages.push(imageId);
                icon.textContent = 'favorite';
                icon.classList.add('Liked');
            }
            localStorage.setItem('liked_images', JSON.stringify(likedImages));
        });
    });

    // Enviar comentario
    container.querySelectorAll('.comment-section a').forEach(btn => {
        btn.addEventListener('click', async () => {
            const imageId = btn.getAttribute('data-imageid');
            const input = document.getElementById(`comment-${imageId}`);
            const text = input.value.trim();
            if (!text) return;
            await fetch(`http://localhost:5000/api/comment/${imageId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, comment: text })
            });
            input.value = '';
            // Recarga galería tras comentar
            const users = await fetch('/api/users').then(res => res.json());
            loadGallery(users, onlyMine);
        });
    });
}