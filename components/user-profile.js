class UserProfile extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    async render() {
        // Obtén user_id de la query string, ej: ?user_id=2
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('user_id');
        if (!userId) {
            this.innerHTML = `<div class="container white-text center-align" style="margin:48px auto;">Usuario no encontrado</div>`;
            return;
        }

        // Cargar datos de usuario
        let user = null;
        try {
            const res = await fetch(`https://backend-ilaq.onrender.com/api/profile/${userId}`);
            if (res.ok) {
                user = await res.json();
            }
        } catch {}

        // Cargar galería de usuario
        let images = [];
        try {
            const res = await fetch("https://backend-ilaq.onrender.com/api/images");
            if (res.ok) {
                images = await res.json();
            }
        } catch {}

        // SVG avatar por defecto codificado en base64 (azul, sencillo)
        const defaultAvatar = "data:image/svg+xml;base64," +
            btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 110 110"><circle cx="55" cy="55" r="55" fill="#bbdefb"/><circle cx="55" cy="45" r="25" fill="#7197bb"/><ellipse cx="55" cy="85" rx="35" ry="18" fill="#7197bb"/></svg>`);

        // Renderizado
        this.innerHTML = `
        <div class="container" style="max-width:500px;margin:50px auto 0 auto;">
            <div class="card" style="border-radius:18px;overflow:hidden;background:#1a237e;">
                <div class="card-content center-align">
                    <img id="profile-pic"
                        src="${user && user.photo && user.photo.length > 30
                            ? `data:image/png;base64,${user.photo}`
                            : defaultAvatar}"
                        alt="Foto de perfil"
                        style="width:110px;height:110px;border-radius:50%;border:4px solid #1565c0;background:#fff;margin-bottom:18px;object-fit:cover;"
                        onerror="this.onerror=null;this.src='${defaultAvatar}';">
                    <h4 class="white-text" style="margin-bottom:10px;">${user ? user.username : 'Usuario no encontrado'}</h4>
                    <p class="grey-text text-lighten-2" style="min-height:30px;">${user && user.bio ? user.bio : ''}</p>
                </div>
            </div>
            <h5 class="white-text" style="margin:40px 0 18px 0;">Galería de este usuario</h5>
            <div class="row" id="user-gallery">
                ${images.filter(img => String(img.user_id) === String(userId)).map(img => `
                    <div class="col s12 m6">
                        <div class="card" style="background:#233c6a;border-radius:13px;overflow:hidden;">
                            <div class="card-image">
                                <img src="data:image/jpg;base64,${img.filedata}" alt="${img.filename}" style="height:180px;object-fit:cover;">
                            </div>
                            <div class="card-content white-text" style="font-size:.97em;">${img.filename}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="center-align" style="margin:40px 0 0 0;">
                <a class="btn blue darken-2" href="javascript:history.back()">
                    <i class="material-icons left">arrow_back</i>Volver
                </a>
            </div>
        </div>
        `;
    }
}

customElements.define('user-profile', UserProfile);