class ImageUploader extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
        <div class="fixed-action-btn">
            <a id="fab-upload" class="btn-floating btn-large style="linear-gradient(to bottom, #1a237e, #64b5f6)">
                <i class="material-icons">add_a_photo</i>
            </a>
        </div>

        <!-- Input para recibir archivo -->
        <input type="file" id="imageInput" accept="image/*" style="display: none;">
        `
    }
}

customElements.define('image-uploader', ImageUploader);