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
                    <li><a href="profile.html">Mi Perfil</a></li>
                    <li id="li-logout">
                        <a class="azul grisáceo oscuro-3-text" id="btn-logout" href="#">Cerrar Sesión</a>
                    </li>
                </ul>
            </div>
        </nav>
        `;

        // El único handler de logout
        this.querySelector('#btn-logout')?.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem("user_id");
            window.location.href = 'login.html';
        });
    }
}
customElements.define('my-navbar', Navbar);