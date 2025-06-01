class Navbar extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
        <nav style="background-color: #F5F5DC;">
            <div class="nav-wrapper container">
                <a href="#" class="grey-text text-lighten-15 brand-logo">MyPinterest</a>
                <ul class="right">
                    <li id="li-general"><a id="btn-general" style="color: grey;">Galería general</a></li>
                    <li id="li-misfotos"><a id="btn-misfotos" style="color: grey;">Mi galería</a></li>
                    <li id="li-logout">
                        <a class="grey-text" id="btn-logout">Cerrar Sesión</a>
                    </li>
                </ul>
            </div>
        </nav>
        `
    }
}

customElements.define('my-navbar', Navbar);