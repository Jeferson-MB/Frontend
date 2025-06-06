class Navbar extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <nav style="background: linear-gradient(to bottom, #1a237e, #64b5f6)">
            <div class="nav-wrapper container">
                <a href="index.html" class="navbar-title-gradient brand-logo">MyPinterest</a>
                <ul class="right">
                    <li id="li-general"><a href="index.html" id="btn-general" style="color: #fff;">Galería general</a></li>
                    <li id="li-misfotos"><a href="mygallery.html" id="btn-misfotos" style="color: #fff;">Mi galería</a></li>
                    <li><a href="profile.html" id="btn-miperfil">Mi Perfil</a></li>
                    <li id="li-logout">
                        <a class="azul grisáceo oscuro-3-text" id="btn-logout" href="#">Cerrar Sesión</a>
                    </li>
                </ul>
            </div>
        </nav>
        `;

        this.querySelector('#btn-logout')?.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem("user_id");
            window.location.href = 'login.html';
        });

        // --- Agrega aquí el handler para Mi Perfil ---
        this.querySelector('#btn-miperfil')?.addEventListener('click', (e) => {
            e.preventDefault();
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                if (typeof M !== 'undefined' && M.toast) {
                    M.toast({html: "Debes iniciar sesión para ver tu perfil", classes: 'red'});
                } else {
                    alert("Debes iniciar sesión para ver tu perfil");
                }
                return;
            }
            window.location.href = `profile.html?user_id=${userId}`;
        });
    }
}
customElements.define('my-navbar', Navbar);