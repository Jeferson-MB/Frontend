class SpinnerLoader extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
        <div id="loader" class="center-align" style="margin-top: 30px; display: none;">
            <div class="preloader-wrapper active">
                <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}

customElements.define('spinner-loader', SpinnerLoader);