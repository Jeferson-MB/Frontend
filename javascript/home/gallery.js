// importamos modulos externos de javascript
import { URI } from "../uri.js";
import { fetchComments, fetchImages } from "./services/api.js";

export async function loadGallery(users, onlyMine = false) {
    const userId = parseInt(localStorage.getItem("user_id"));
    const container = document.getElementById("gallery");
    const loader = document.getElementById("loader");

    loader.style.display = 'block';
    container.innerHTML = '';

    // Manda a traer las imágenes
    const images = await fetchImages();
    images.forEach(img => {
        // Pregunta si el usuario que subió la foto es el mismo que está logueado
        const isMine = parseInt(img.user_id) === userId;

        // Es para saber si la persona logueada es la misma de las fotos o no
        if (onlyMine && !isMine) return;
        if (!onlyMine && isMine) return;

        // Encontramos a la persona que cargó la imagen
        const uploader = users.find(u => u.id == img.user_id);
        const uploaderName = uploader ? (uploader.id === userId ? 'Tú' : uploader.username) 
        : 'Desconocido';

        const commentsHtml = img.comments.map(c => {
            // Encontramos a la persona que comentó en la base de datos
            const commenter = users.find(u => u.id === c.user_id);

            // Pregunta si el comentario es de la persona loggueada o no
            const commenterName = commenter ? (commenter.id === userId ? 'Tú' : commenter.username) 
            :'Anonimo';

            return `<p><strong>${commenterName}</strong>: ${c.text}</p>`;
        }).join('');

        // <div class='col s12 m6 l4'></div>
        const card = document.createElement('div');
        card.className = 'col s12 m6 l4';
        card.innerHTML = `
            <div class='card hoverable z-depth-3'>
                <div class='card-image'>
                    <img class='materialboxed' src='${URI}/static/uploads/${img.filename}' />
                </div>
                <div class='card-content'>
                    <span class='card-title'>Subido por: <strong>${uploaderName}</strong></span>
                    ${commentsHtml || '<p>Sin comentarios aun</p>'}
                    
                    <div class='comment-section row'>
                        <div class="input-field" style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 30px; padding: 0 10px;">
                        <input id="comment-${img.id}" type="text" placeholder="Envía un mensaje" style="border: none; box-shadow: none; margin: 0; flex: 1;">    

                        <a data-imageid="${img.id}" class="btn-flat waves-effect waves-grey" style="min-width: auto; padding: 0;">
                            <i class="material-icons">send</i>
                        </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    M.Materialbox.init(document.querySelectorAll('.materialboxed'));

    // Evento para agregar comentario
    container.querySelectorAll('.comment-section a').forEach(btn => {
        btn.addEventListener('click', () => {
            const imageId = btn.getAttribute('data-imageid');
            const input = document.getElementById(`comment-${imageId}`);
            const text = input.value.trim();
            if (!text) return;
            fetchComments(imageId, userId, text).then(console.log);
        });
    });

    loader.style.display = 'none';
}
