class MyFooter extends HTMLElement {
    constructor() {
        super();

        this.innerHTML =  /*html*/`
            <div "style="background: linear-gradient(to bottom, #1a237e, #64b5f6)>
                <div class='container'>
                    <div class='row'>
                        <div class='col l6 s12'>
                            <h5 class='grey-text'>MyPinterest</h5>
                            <p class='grey-text'>Hecho con Flask y Materialize</p>
                        </div>
                        <div class='col l4 offset-l2 s12'>
                            <h5 class='grey-text'>Enlaces</h5>
                            <ul>
                                <li>
                                    <a class='grey-text' href='index.html'>
                                        Galería
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class='footer-copyright background: linear-gradient(to bottom, #1a237e, #64b5f6)'>
                    <div class='container'>
                        @ 2025 JefersonAMB
                    </div>
                </div>
            </footer>
        `
    }
}

customElements.define('my-footer', MyFooter);