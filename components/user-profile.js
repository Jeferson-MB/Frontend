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
        const urlParams = new URLSearchParams(window.location.search);
        const param_user_id = urlParams.get("user_id");
        const local_user_id = localStorage.getItem("user_id");
        const user_id = param_user_id || local_user_id;

        const usernameElem = this.querySelector('#profile-username');
        const photoElem = this.querySelector('#profile-photo');

        if (!user_id) {
            usernameElem.textContent = "No logueado";
            photoElem.src = "https://ui-avatars.com/api/?name=Usuario";
            return;
        }

        // Obtener datos del perfil
        fetch(`http://localhost:5000/api/profile/${user_id}`)
            .then(res => res.json())
            .then(data => {
                usernameElem.textContent = data.username;
                photoElem.src = data.photo
                    ? `data:image/png;base64,${data.photo}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username)}`;
            })
            .catch(() => {
                usernameElem.textContent = "Error de perfil";
                photoElem.src = "https://ui-avatars.com/api/?name=Usuario";
            });

        // Obtener imágenes del usuario
        fetch('http://localhost:5000/api/images')
            .then(res => res.json())
            .then(images => {
                const myPhotos = images.filter(img => String(img.user_id) === String(user_id));
                const myPhotosDiv = this.querySelector('#my-photos');

                if (myPhotos.length === 0) {
                    myPhotosDiv.innerHTML = "<p>No tiene fotos subidas aún.</p>";
                    return;
                }

                myPhotos.forEach(img => {
                    const col = document.createElement('div');
                    col.className = 'col s12 m6 l4';

                    const imgSrc = img.image_data && img.mime_type
                        ? `data:${img.mime_type};base64,${img.image_data}`
                        : `http://localhost:5000/static/uploads/${img.filename}`;

                    col.innerHTML = `
                        <div class='card hoverable z-depth-3'>
                            <div class='card-image'>
                                <img class='materialboxed' src='${imgSrc}' />
                            </div>
                        </div>
                    `;
                    myPhotosDiv.appendChild(col);
                });

                if (window.M && M.Materialbox) {
                    M.Materialbox.init(this.querySelectorAll('.materialboxed'));
                }
            });
    }
}

customElements.define('user-profile', UserProfile);

