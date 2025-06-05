import { fetchComments, fetchImages } from "./services/api.js";

export async function loadGallery(users, onlyMine = false) {
    const userId = parseInt(localStorage.getItem("user_id"));
    const container = document.getElementById("gallery");
    const loader = document.getElementById("loader");

    loader.style.display = 'block';
    container.innerHTML = '';

    const images = await fetchImages();
    images.forEach(img => {
        const isMine = parseInt(img.user_id) === userId;

        // Solo filtrar si está en "mi galería"
        if (onlyMine && !isMine) return;

        // En galería general, mostrar todas (incluidas las mías)
        const uploader = users.find(u => u.id == img.user_id);
        const uploaderName = uploader ? (uploader.id === userId ? 'Tú' : uploader.username) : 'Desconocido';

        const commentsHtml = img.comments.map(c => {
            const commenter = users.find(u => u.id === c.user_id);
            const commenterName = commenter ? (commenter.id === userId ? 'Tú' : commenter.username) : 'Anónimo';
            return `<p><strong>${commenterName}</strong>: ${c.text}</p>`;
        }).join('');

        const card = document.createElement('div');
        card.className = 'col s12 m6 l4';
        card.innerHTML = /*html*/`
            <div class='card hoverable z-depth-3'>
                <div class='card-image'>
                    <img class='materialboxed' src='data:image/jpg;base64,${img.filedata}' />
                </div>
                <div class='card-content'>
                    <div class='like-section'>
                        <a class='btn-floating halfway-fab waves-effect waves-light blue like-btn' data-imageid='${img.id}'>
                            <i class='material-icons'>favorite_border</i>
                        </a>
                    </div>
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
    loader.style.display = 'none';
}