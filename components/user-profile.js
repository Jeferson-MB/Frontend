class UserProfile extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="profile-card center-align">
                <img id="profile-photo" class="profile-photo" src="" alt="Foto de perfil">
                <h5 id="profile-username" class="profile-username"></h5>
                <h6 style="color: #1976D2;">Mis fotos</h6>
                <div id="my-photos" class="row"></div>
            </div>
        `;
    }

    connectedCallback() {
        const user_id = localStorage.getItem("user_id");
        const usernameEl = this.querySelector('#profile-username');
        const photoEl = this.querySelector('#profile-photo');
        const myPhotosDiv = this.querySelector('#my-photos');

        if (!user_id) {
            usernameEl.textContent = "No logueado";
            photoEl.src = "https://ui-avatars.com/api/?name=Usuario";
            return;
        }

        // Cargar datos de perfil
        fetch(`http://localhost:5000/api/profile/${user_id}`)
            .then(res => res.json())
            .then(data => {
                usernameEl.textContent = data.username;
                photoEl.src = data.photo
                    ? `data:image/png;base64,${data.photo}`
                    : "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.username);
            })
            .catch(() => {
                usernameEl.textContent = "Error de perfil";
                photoEl.src = "https://ui-avatars.com/api/?name=Usuario";
            });

        // Cargar fotos del usuario
        fetch('http://localhost:5000/api/images')
            .then(res => res.json())
            .then(images => {
                const myPhotos = images.filter(img => String(img.user_id) === String(user_id));
                myPhotosDiv.innerHTML = "";

                if (myPhotos.length === 0) {
                    myPhotosDiv.innerHTML = "<p>No tienes fotos subidas aún.</p>";
                    return;
                }

                myPhotos.forEach(img => {
                    const col = document.createElement('div');
                    col.className = 'col s12 m6 l4';
                    col.innerHTML = `
                        <div class='card hoverable z-depth-3'>
                            <div class='card-image'>
                                <img class='materialboxed' src='http://localhost:5000/static/uploads/${img.filename}' />
                            </div>
                        </div>
                    `;
                    myPhotosDiv.appendChild(col);
                });

                // Inicializar Materialbox solo dentro del componente
                if (window.M && M.Materialbox) {
                    const images = this.querySelectorAll('.materialboxed');
                    M.Materialbox.init(images);
                }
            })
            .catch(() => {
                myPhotosDiv.innerHTML = "<p>Error al cargar tus fotos.</p>";
            });
    }
}

customElements.define('user-profile', UserProfile);
