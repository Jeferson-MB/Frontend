import { fetchImages, postComment } from "./services/api.js";

export function renderGallery(container, users) {
    fetchImages().then(images => {
        container.innerHTML = "";
        images.forEach(img => {
            const card = document.createElement('div');
            card.className = 'col s12 m6 l4';
            card.innerHTML = `
                <div class='card hoverable z-depth-3' style="margin-bottom:32px;">
                    <div class='card-image'>
                        <img class='materialboxed' src='http://localhost:5000/static/uploads/${img.filename}' style="margin:auto;max-height:320px;object-fit:contain;" />
                    </div>
                    <div class='card-content'>
                        <span class='card-title' style="font-size:1.1rem;font-weight:700;">Subido por: ${getUploaderName(img.user_id, users)}</span>
                        <div style="margin:8px 0 16px 0;">
                            ${renderComments(img.comments, users)}
                        </div>
                        <div class="input-field" style="margin:0;">
                            <input id="comment-${img.id}" type="text" placeholder="Envía un mensaje" style="border-radius:25px;padding-left:16px;padding-right:40px;" />
                            <button data-imageid="${img.id}" class="btn-flat send-comment-btn" style="position:absolute;right:8px;top:4px;min-width:32px;">
                                <i class="material-icons">send</i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        if (window.M && M.Materialbox) {
            M.Materialbox.init(document.querySelectorAll('.materialboxed'));
        }
        enableCommentSending(container);
    });
}

function getUploaderName(userId, users) {
    const uploader = users.find(u => Number(u.id) === Number(userId));
    if (!uploader) return "<strong>Desconocido</strong>";
    return uploader.username;
}

function renderComments(comments, users) {
    if (!Array.isArray(comments) || comments.length === 0) {
        return `<span style="color:#888;">Sin comentarios aún</span>`;
    }
    return comments.map(c => {
        const commenter = users.find(u => Number(u.id) === Number(c.user_id));
        const commenterName = commenter ? commenter.username : "Anónimo";
        return `<span style="font-weight:500;color:#222;">${commenterName}:</span> ${c.text}`;
    }).join('<br>');
}

export function enableCommentSending(container) {
    container.querySelectorAll('.send-comment-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const imageId = btn.getAttribute('data-imageid');
            const input = container.querySelector(`#comment-${imageId}`);
            const text = input.value.trim();
            if (!text) return;
            const userId = Number(localStorage.getItem("user_id"));
            await postComment(imageId, userId, text);
            input.value = "";
            // Recargar comentarios
            // Puedes llamar a renderGallery(container, users) si lo necesitas
        });
    });

    container.querySelectorAll('input[id^="comment-"]').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const imageId = input.id.replace("comment-", "");
                const userId = Number(localStorage.getItem("user_id"));
                const text = input.value.trim();
                if (!text) return;
                postComment(imageId, userId, text).then(() => {
                    input.value = "";
                    // Recargar comentarios
                    // Puedes llamar a renderGallery(container, users) si lo necesitas
                });
            }
        });
    });
}