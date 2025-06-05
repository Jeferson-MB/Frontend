class UserProfile extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="center-align" style="margin-top:30px;margin-bottom:20px;">
                <a href="index.html" class="btn-large waves-effect waves-light blue" style="border-radius:30px;">
                    <i class="material-icons left">arrow_back</i>
                    Volver a la galería
                </a>
            </div>
            <div class="profile-card center-align">
                <img id="profile-photo" class="profile-photo" src="" alt="Foto de perfil">
                <h5 id="profile-username" class="profile-username"></h5>
                <div id="change-photo-section"></div>
                <div id="my-photos" class="user-photos"></div>
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

        // Si es mi perfil, muestro el input para cambiar foto
        if (user_id === my_id) {
            this.querySelector('#change-photo-section').innerHTML = `
                <div class="change-photo-container">
                    <label for="new-profile-photo" class="btn-flat waves-effect waves-blue blue-text text-darken-2" style="cursor:pointer;">
                        <i class="material-icons left">photo_camera</i>Seleccionar nueva foto
                    </label>
                    <input type="file" id="new-profile-photo" accept="image/*" style="display:none;">
                    <img id="preview-photo" style="display:none;margin-top:10px;border-radius:50%;width:80px;height:80px;object-fit:cover;border:2px solid #1976D2;">
                    <br>
                    <button id="btn-change-photo" class="btn blue" style="margin-top:10px;display:none;">
                        <i class="material-icons left">cloud_upload</i>Cambiar foto de perfil
                    </button>
                    <div id="photo-msg" class="blue-text" style="margin-top:10px;"></div>
                </div>
            `;

            const fileInput = this.querySelector('#new-profile-photo');
            const preview = this.querySelector('#preview-photo');
            const btnChange = this.querySelector('#btn-change-photo');
            const msg = this.querySelector('#photo-msg');

            fileInput.addEventListener('change', () => {
                const file = fileInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        preview.src = reader.result;
                        preview.style.display = 'inline-block';
                        btnChange.style.display = 'inline-block';
                        msg.textContent = '';
                    };
                    reader.readAsDataURL(file);
                } else {
                    preview.style.display = 'none';
                    btnChange.style.display = 'none';
                }
            });

            btnChange.onclick = async () => {
                const file = fileInput.files[0];
                if (!file) {
                    msg.textContent = "Selecciona una imagen primero.";
                    msg.className = "red-text";
                    return;
                }
                btnChange.disabled = true;
                msg.textContent = "Subiendo...";
                msg.className = "blue-text";
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64Image = reader.result.split(',')[1];
                    const response = await fetch(`http://localhost:5000/api/profile/${user_id}/photo`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ profile_photo: base64Image })
                    });
                    const result = await response.json();
                    btnChange.disabled = false;
                    if (result.success) {
                        this.querySelector('#profile-photo').src = `data:image/png;base64,${result.photo}`;
                        msg.textContent = "¡Foto de perfil actualizada!";
                        msg.className = "green-text";
                        setTimeout(() => {
                            preview.style.display = 'none';
                            btnChange.style.display = 'none';
                            fileInput.value = '';
                            msg.textContent = '';
                            msg.className = "blue-text";
                        }, 2000);
                    } else {
                        msg.textContent = result.error || "Error al actualizar foto";
                        msg.className = "red-text";
                    }
                };
                reader.readAsDataURL(file);
            };
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