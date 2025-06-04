// importamos modulos externos de javascript
import { URI } from "../uri.js";
import { fetchComments, fetchImages } from "./services/api.js";

export async function loadGallery(users, onlyMine = false) {
    const userId = parseInt(localStorage.getItem("user_id"));
    const container = document.getElementById("gallery");
    const loader = document.getElementById("loader");

    if (loader) loader.style.display = 'block';
    container.innerHTML = '';

    try {
        // Manda a traer las imágenes
        const images = await fetchImages();
        
        if (!images || images.length === 0) {
            container.innerHTML = '<div class="col s12"><p class="center-align grey-text">No hay imágenes disponibles</p></div>';
            if (loader) loader.style.display = 'none';
            return;
        }

        images.forEach(img => {
            // Pregunta si el usuario que subió la foto es el mismo que está logueado
            const isMine = parseInt(img.user_id) === userId;

            // Lógica corregida de filtrado
            if (onlyMine && !isMine) return; // Si solo quiero las mías y esta no es mía, saltarla
            if (!onlyMine && isMine) return; // Si quiero ver las de otros y esta es mía, saltarla

            // Encontramos a la persona que cargó la imagen
            const uploader = users.find(u => parseInt(u.id) === parseInt(img.user_id));
            
            // Crear enlace al perfil del usuario
            let uploaderNameHtml;
            if (uploader) {
                if (parseInt(uploader.id) === userId) {
                    uploaderNameHtml = '<strong>Tú</strong>';
                } else {
                    uploaderNameHtml = `<a class="profile-link" href="profile.html?user_id=${uploader.id}" style="color: #64788d; text-decoration: none;"><strong>${uploader.username}</strong></a>`;
                }
            } else {
                uploaderNameHtml = '<strong>Desconocido</strong>';
            }

            // Procesar comentarios si existen
            let commentsHtml = '';
            if (img.comments && Array.isArray(img.comments)) {
                commentsHtml = img.comments.map(c => {
                    // Encontramos a la persona que comentó en la base de datos
                    const commenter = users.find(u => parseInt(u.id) === parseInt(c.user_id));

                    // Crear enlace al perfil del comentarista
                    let commenterNameHtml;
                    if (commenter) {
                        if (parseInt(commenter.id) === userId) {
                            commenterNameHtml = '<strong>Tú</strong>';
                        } else {
                            commenterNameHtml = `<a class="profile-link" href="profile.html?user_id=${commenter.id}" style="color: #64788d; text-decoration: none;"><strong>${commenter.username}</strong></a>`;
                        }
                    } else {
                        commenterNameHtml = '<strong>Anónimo</strong>';
                    }

                    return `<p style="margin: 5px 0; font-size: 14px;">${commenterNameHtml}: ${c.text || c.comment}</p>`;
                }).join('');
            }

            if (!commentsHtml) {
                commentsHtml = '<p class="grey-text" style="font-size: 14px; margin: 5px 0;">Sin comentarios aún</p>';
            }

            // Crear la imagen src con base64
            const imageSrc = img.filedata 
                ? `data:image/jpeg;base64,${img.filedata}` 
                : (img.filename ? `${URI}/static/uploads/${img.filename}` : '');

            if (!imageSrc) {
                console.warn('Imagen sin datos:', img);
                return;
            }

            const card = document.createElement('div');
            card.className = 'col s12 m6 l4';
            card.innerHTML = /*html*/`
                <div class='card hoverable z-depth-3'>
                    <div class='card-image'>
                        <img class='materialboxed responsive-img' src='${imageSrc}' alt='Imagen de galería' />
                    </div>
                    <div class='card-content'>
                        <div class='like-section'>
                            <a class='btn-floating halfway-fab waves-effect waves-light grey 
                                like-btn' data-imageid='${img.id}'>
                                <i class='material-icons'>favorite_border</i>
                            </a>
                        </div>
                        <span class='card-title'>Subido por: ${uploaderNameHtml}</span>
                        <div class="comments-section" style="margin-top: 15px; max-height: 150px; overflow-y: auto; border-top: 1px solid #eee; padding-top: 10px;">
                            ${commentsHtml}
                        </div>
                        
                        <div class='comment-section row' style="margin-top: 15px; margin-bottom: 0;">
                            <div class="input-field col s12" style="margin: 0;">
                                <div style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 25px; padding: 5px 15px; background: #fafafa;">
                                    <input id="comment-${img.id}" type="text" placeholder="Envía un mensaje" style="border: none; box-shadow: none; margin: 0; flex: 1; background: transparent; height: 30px;" maxlength="200">    
                                    <a data-imageid="${img.id}" class="btn-flat waves-effect waves-grey comment-btn" style="min-width: auto; padding: 0 5px; margin: 0;">
                                        <i class="material-icons" style="font-size: 20px;">send</i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Inicializar Materialbox después de agregar todas las imágenes
        if (window.M && M.Materialbox) {
            M.Materialbox.init(document.querySelectorAll('.materialboxed'));
        }

        // Evento para agregar comentario
        container.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const imageId = btn.getAttribute('data-imageid');
                const input = document.getElementById(`comment-${imageId}`);
                const text = input.value.trim();
                
                if (!text) {
                    M.toast({html: 'Escribe un comentario', classes: 'orange'});
                    return;
                }
                
                try {
                    btn.style.pointerEvents = 'none'; // Prevenir doble click
                    await fetchComments(imageId, userId, text);
                    input.value = ''; // Limpiar el input
                    M.toast({html: 'Comentario agregado', classes: 'green'});
                    // Recargar la galería para mostrar el nuevo comentario
                    loadGallery(users, onlyMine);
                } catch (error) {
                    console.error('Error al agregar comentario:', error);
                    M.toast({html: 'Error al agregar comentario', classes: 'red'});
                } finally {
                    btn.style.pointerEvents = 'auto';
                }
            });
        });

        // Evento para enter en input de comentarios
        container.querySelectorAll('input[id^="comment-"]').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const imageId = input.id.replace('comment-', '');
                    const btn = container.querySelector(`[data-imageid="${imageId}"]`);
                    if (btn) btn.click();
                }
            });
        });

        // Evento para manejar likes
        container.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const imageId = btn.getAttribute('data-imageid');
                const icon = btn.querySelector('i');

                if (icon.textContent === 'favorite_border') {
                    icon.textContent = 'favorite';
                    icon.classList.add('white-text');
                    btn.classList.add('red');
                    btn.classList.remove('grey');
                    M.toast({html: 'Te gusta esta imagen', classes: 'pink'});
                } else {
                    icon.textContent = 'favorite_border';
                    icon.classList.remove('white-text');
                    btn.classList.remove('red');
                    btn.classList.add('grey');
                }
            });
        });

    } catch (error) {
        console.error('Error cargando la galería:', error);
        container.innerHTML = '<div class="col s12"><p class="center-align red-text">Error cargando las imágenes. Verifica tu conexión.</p></div>';
        M.toast({html: 'Error cargando imágenes', classes: 'red'});
    } finally {
        if (loader) loader.style.display = 'none';
    }
}