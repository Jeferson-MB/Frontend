class Navbar extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
        <nav style="background: linear-gradient(to bottom, #1a237e, #64b5f6)">
            <div class="nav-wrapper container">
                <a href="#" class="grey-text text-lighten-15 brand-logo">MyPinterest</a>
                <ul class="right">
                    <li id="li-general"><a id="btn-general" style="background: linear-gradient(to bottom, #1a237e, #64b5f6)"">Galería general</a></li>
                    <li id="li-misfotos"><a id="btn-misfotos" style="background: linear-gradient(to bottom, #1a237e, #64b5f6)"">Mi galería</a></li>
                    <li id="li-logout">
                        <a class="blue-text" id="btn-logout">Cerrar Sesión</a>
                    </li>
                </ul>
            </div>
        </nav>
        `
    }
}

customElements.define('my-navbar', Navbar);