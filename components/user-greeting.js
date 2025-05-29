class UserGreeting extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
            <!-- Muestra el nombre del usuario -->
            <h5 id="user-greeting" class="black-text text-darken-2"></h5>
        `
    }
}

customElements.define('user-greeting', UserGreeting);