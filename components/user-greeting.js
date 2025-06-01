class UserGreeting extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
            <!-- Muestra el nombre del usuario -->
            <h5 id="user-greeting" class="grey-text text-lighten-15"></h5>
        `
    }
}

customElements.define('user-greeting', UserGreeting);