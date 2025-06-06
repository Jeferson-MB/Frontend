export async function loadGallery(users, onlyMine = false) {
    const myUserId = Number(localStorage.getItem("user_id"));
    const container = document.getElementById("gallery");

    container.innerHTML = '';

    const res = await fetch('http://localhost:5000/api/images');
    const images = await res.json();

    images.forEach(img => {
        const isMine = Number(img.user_id) === myUserId;

        if (onlyMine && !isMine) return;
        if (!onlyMine && isMine) return;

        const uploader = users.find(u => Number(u.id) === Number(img.user_id));
        let uploaderHTML = '';
        if (uploader) {
            if (Number(uploader.id) === myUserId) {
                uploaderHTML = '<span style="color:#039be5;font-weight:600;">' + uploader.username + '</span>';
            } else {
                uploaderHTML = `<a class="profile-link" style="color:#039be5;font-weight:600;" href="profile.html?user_id=${uploader.id}">${uploader.username}</a>`;
            }
        } else {
            uploaderHTML = '<strong>Desconocido</strong>';
        }

        // Recupera comentario si existe:
        let comentarioHTML = '';
        if (img.comentario && img.comentario !== '') {
            comentarioHTML = `<span style="font-weight:500;color:#222;">${uploader ? uploader.username : 'Usuario'}:</span> ${img.comentario}`;
        } else {
            comentarioHTML = `<span style="color:#888;">Sin comentarios aun</span>`;
        }

        // Card con mensaje y botón como antes
        const card = document.createElement('div');
        card.className = 'col s12 m6 l4';
        card.innerHTML = `
            <div class='card hoverable z-depth-3' style="margin-bottom:32px;">
                <div class='card-image'>
                    <img class='materialboxed' src='http://localhost:5000/static/uploads/${img.filename}' style="margin:auto;max-height:320px;object-fit:contain;" />
                </div>
                <div class='card-content'>
                    <span class='card-title' style="font-size:1.1rem;font-weight:700;">Subido por: ${uploaderHTML}</span>
                    <div style="margin:8px 0 16px 0;">${comentarioHTML}</div>
                    <div class="input-field" style="margin:0;">
                        <input type="text" placeholder="Envía un mensaje" style="border-radius:25px;padding-left:16px;padding-right:40px;" />
                        <button class="btn-flat" style="position:absolute;right:8px;top:4px;min-width:32px;"><i class="material-icons">arrow_forward</i></button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    if (window.M && M.Materialbox) {
        M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    }
}