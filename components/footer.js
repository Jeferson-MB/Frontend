class MyFooter extends HTMLElement {
    constructor() {
        super();

        this.innerHTML =  /*html*/`
            <footer class='page-footer' style="background-color: #F5F5DC;">
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

                <div class='footer-copyright grey'>
                    <div class='container'>
                        @ 2025 IJCanchan
                    </div>
                </div>
            </footer>
        `
    }
}

customElements.define('my-footer', MyFooter);