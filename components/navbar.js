class Navbar extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <nav style="background: linear-gradient(to bottom, #1a237e, #64b5f6)">
            <div class="nav-wrapper container">
                <a href="/" class="brand-logo" style="padding-left: 20px;">MyPinterest</a>
                <ul class="right hide-on-med-and-down">
                    <li><a href="/gallery" style="color: #ECEFF1;">Galería general</a></li>
                    <li><a href="/my-gallery" style="color: #ECEFF1;">Mi galería</a></li>
                    <li><a href="/profile" style="color: #ECEFF1;">Perfil</a></li>
                    <li><a href="/logout" style="color: #ECEFF1;">Cerrar Sesión</a></li>
                </ul>
            </div>
        </nav>
        `;
    }
}

customElements.define('my-navbar', Navbar);
