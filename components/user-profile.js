class UserProfile extends HTMLElement {
    connectedCallback() {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            this.innerHTML = "<p>Usuario no autenticado</p>";
            return;
        }

        Promise.all([
            fetch(`http://127.0.0.1:5000/api/profile/${userId}`).then(res => res.json()),
            fetch('http://127.0.0.1:5000/api/images').then(res => res.json())
        ])
        .then(([user, images]) => {
            const userImages = images.filter(img => img.user_id == userId);

            this.innerHTML = `
                <div class="container white-text center-align">
                    <h4>${user.nombre}</h4>
                    <img src="${user.imagen}" alt="Foto de perfil" class="circle responsive-img" width="150">
                    <h5>Galería</h5>
                    <div class="row">
                        ${userImages.map(img => `
                            <div class="col s12 m4">
                                <img src="${img.imagen_base64}" class="responsive-img z-depth-3">
                                <p>${img.nombre}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        })
        .catch(err => {
            this.innerHTML = "<p>Error al cargar el perfil</p>";
            console.error(err);
        });
    }
}

customElements.define('user-profile', UserProfile);



