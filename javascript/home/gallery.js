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
                        <span class='card-title' style="font-size:1.1rem;font-weight:700;">
                          Subido por: <span class="profile-link" data-userid="${img.user_id}" style="color:#1565c0;cursor:pointer;text-decoration:underline;font-weight:bold;">
                            ${getUploaderName(img.user_id, users)}
                          </span>
                        </span>
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
        setupProfileLinkModal();
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
                    // Recargar comentarios si es necesario
                });
            }
        });
    });
}

// Modal único para perfil de usuario
function setupProfileLinkModal() {
    if (!document.getElementById('profile-modal')) {
        const modal = document.createElement('div');
        modal.id = 'profile-modal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.6)';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div id="profile-modal-content" style="
                background:#233c6a;
                color:#fff;
                border-radius:18px;
                max-width:360px;
                margin:60px auto 0 auto;
                box-shadow:0 4px 20px #0009;
                padding:34px 28px 32px 28px;
                text-align:center;
                position:relative;
            ">
                <span id="close-profile-modal" style="
                    position:absolute;right:18px;top:16px;
                    color:#bbb;font-size:2rem;cursor:pointer;font-weight:bold;">&times;</span>
                <img id="modal-profile-pic" src="default-profile.png" style="width:100px;height:100px;object-fit:cover;border-radius:50%;border:3px solid #1565c0;background:#fff;margin-bottom:20px;">
                <div id="modal-username" style="font-size:1.8rem;color:#fff;margin-bottom:8px;"></div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-profile-modal').onclick = function() {
            document.getElementById('profile-modal').style.display = 'none';
        };
    }

    // Delegación para todos los .profile-link
    document.querySelectorAll('.profile-link').forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            const userId = this.getAttribute('data-userid');
            fetch(`http://127.0.0.1:5000/api/profile/${userId}`)
                .then(res => res.ok ? res.json() : null)
                .then(user => {
                    if (!user) {
                        document.getElementById('modal-username').textContent = "Usuario no encontrado";
                        document.getElementById('modal-profile-pic').src = "default-profile.png";
                    } else {
                        document.getElementById('modal-username').textContent = user.username || "Sin nombre";
                        if (user.photo && user.photo.length > 30) {
                            document.getElementById('modal-profile-pic').src = `data:image/png;base64,${user.photo}`;
                        } else {
                            document.getElementById('modal-profile-pic').src = "default-profile.png";
                        }
                    }
                    document.getElementById('profile-modal').style.display = 'block';
                });
        };
    });
}