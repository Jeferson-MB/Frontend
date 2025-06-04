class UserProfile extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="profile-card center-align">
                <img id="profile-photo" class="profile-photo" src="" alt="Foto de perfil">
                <h5 id="profile-username" class="profile-username"></h5>
            </div>
        `;
    }

    connectedCallback() {
        // Obtén el user_id de donde lo guardes, por ejemplo localStorage
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
            this.querySelector('#profile-username').textContent = "No logueado";
            this.querySelector('#profile-photo').src = "https://ui-avatars.com/api/?name=Usuario";
            return;
        }
        fetch(`http://localhost:5000/api/profile/${user_id}`)
            .then(res => res.json())
            .then(data => {
                this.querySelector('#profile-username').textContent = data.username;
                if (data.photo) {
                    this.querySelector('#profile-photo').src = `data:image/png;base64,${data.photo}`;
                } else {
                    this.querySelector('#profile-photo').src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.username);
                }
            })
            .catch(() => {
                this.querySelector('#profile-username').textContent = "Error de perfil";
                this.querySelector('#profile-photo').src = "https://ui-avatars.com/api/?name=Usuario";
            });
    }
}
customElements.define('user-profile', UserProfile);