class UserProfile extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="profile-card center-align" style="max-width: 500px; margin: 40px auto;">
                <img id="profile-photo" class="profile-photo" src="" alt="Foto de perfil" style="margin-top: 25px;">
                <h5 id="profile-username" class="profile-username"></h5>
                <div id="change-photo-section"></div>
                <div id="my-photos" class="user-photos" style="margin-top: 30px;"></div>
            </div>
        `;
    }

    connectedCallback() {
        const params = new URLSearchParams(window.location.search);
        let user_id = params.get("user_id");
        const my_id = localStorage.getItem("user_id");
        if (!user_id) user_id = my_id;

        if (!user_id) {
            this.querySelector('#profile-username').textContent = "No logueado";
            this.querySelector('#profile-photo').src = "https://ui-avatars.com/api/?name=Usuario";
            return;
        }

        // Elimina los botones de cambio de foto (no mostrar nada)
        if (user_id === my_id) {
            this.querySelector('#change-photo-section').innerHTML = "";
        }

        // Cargar datos usuario + fotos
        const cargarPerfilYFotos = () => {
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

            fetch('http://localhost:5000/api/images')
                .then(res => res.json())
                .then(images => {
                    const myImages = images.filter(img => Number(img.user_id) === Number(user_id));
                    const container = this.querySelector('#my-photos');
                    container.innerHTML = "<h6>Fotos de este usuario</h6>";
                    myImages.forEach(img => {
                        const imgElem = document.createElement("img");
                        imgElem.src = `data:image/jpg;base64,${img.filedata}`;
                        imgElem.alt = img.filename;
                        imgElem.style.width = "100px";
                        imgElem.style.margin = "5px";
                        container.appendChild(imgElem);
                    });
                });
        };

        cargarPerfilYFotos();
    }
}
customElements.define('user-profile', UserProfile);