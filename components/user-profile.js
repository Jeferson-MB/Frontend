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
        if (!user_id) {
            this.querySelector('#profile-username').textContent = "No logueado";
            this.querySelector('#profile-photo').src = "https://ui-avatars.com/api/?name=Usuario";
            return;
        }

        // Cargar datos de perfil
        fetch(`http://localhost:5000/api/profile/${user_id}`)
            .then(res => res.json())
            .then(data => {
                this.querySelector('#profile-username').textContent = data.username;
                if (data.photo) {
                    this.querySelector('#profile-photo').src = `data:image/png;base64,${data.photo}`;
                } else {
                    this.querySelector('#profile-photo').src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.username);
                }
            });

        // Cargar fotos del usuario
        fetch('http://localhost:5000/api/images')
            .then(res => res.json())
            .then(images => {
                const myPhotos = images.filter(img => String(img.user_id) === String(user_id));
                const myPhotosDiv = this.querySelector('#my-photos');
                if (myPhotos.length === 0) {
                    myPhotosDiv.innerHTML = "<p>No tienes fotos subidas aún.</p>";
                } else {
                    myPhotos.forEach(img => {
                        const col = document.createElement('div');
                        col.className = 'col s12 m6 l4';
                        col.innerHTML = `
                            <div class='card hoverable z-depth-3'>
                                <div class='card-image'>
                                    <img class='materialboxed' src='data:image/jpeg;base64,${img.data}' />
                                </div>
                            </div>
                        `;
                        myPhotosDiv.appendChild(col);
                    });
                }

                if (window.M && M.Materialbox) {
                    M.Materialbox.init(this.querySelectorAll('.materialboxed'));
                }
            });
    }
}
customElements.define('user-profile', UserProfile);
