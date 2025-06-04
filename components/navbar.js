class MyNavbar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <nav class="blue darken-4">
                <div class="nav-wrapper">
                    <a href="/" class="brand-logo" style="padding-left: 20px;">MyPinterest</a>
                    <ul id="nav-mobile" class="right hide-on-med-and-down">
                        <li id="li-gallery"><a href="/gallery">Galería general</a></li>
                        <li id="li-my-gallery"><a href="/my-gallery">Mi galería</a></li>
                        <li id="li-profile"><a href="#" id="btn-perfil">Perfil</a></li>
                        <li id="li-logout"><a href="/logout">Cerrar Sesión</a></li>
                    </ul>
                </div>
            </nav>
        `;
    }
}

customElements.define('my-navbar', MyNavbar);


