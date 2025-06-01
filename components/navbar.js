class Navbar extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
        <nav style="background: linear-gradient(to bottom, #1a237e, #64b5f6)">
            <div class="nav-wrapper container">
                <a href="#" class="navbar-title-gradient brand-logo">MyPinterest</a>
                <ul class="right">
                    <li id="li-general"><a id="btn-general" style="color: azul grisáceo oscuro-3;">Galería general</a></li>
                    <li id="li-misfotos"><a id="btn-misfotos" style="color: azul grisáceo oscuro-3;">Mi galería</a></li>
                    <li id="li-logout">
                        <a class="azul grisáceo oscuro-3-text" id="btn-logout">Cerrar Sesión</a>
                    </li>
                </ul>
            </div>
        </nav>
        `
    }
}

customElements.define('my-navbar', Navbar);