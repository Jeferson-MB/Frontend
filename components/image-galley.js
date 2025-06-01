class ImageGallery extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
        <!-- Muestra la galería de imágenes -->
        <div class="row" id="gallery"></div>
        `
    }
}

customElements.define('image-gallery', ImageGallery);