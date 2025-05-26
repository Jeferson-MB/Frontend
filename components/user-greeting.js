class UserGreeting extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
            <!-- Muestra el nombre del usuario -->
            <h5 id="user-greeting" class="blue-text text-darken-3"></h5>
        `
    }
}

customElements.define('user-greeting', UserGreeting);