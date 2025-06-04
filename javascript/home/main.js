import { loadGallery } from "./gallery.js";
import { fetchUsers } from "./services/api.js";
import { updateNavbarActive } from "./services/utils.js";
import { initUploader } from "./uploader.js";

document.addEventListener("DOMContentLoaded", () => {
    let viewMyGallery = false;

    const userId = parseInt(localStorage.getItem('user_id'));
    if (!userId) {
        M.toast({html: 'Debes iniciar sesión', classes: 'red'});
        return window.location.href = './login.html';
    }

    async function loadData(onlyMine = false) {
        try {
            const users = await fetchUsers();
            console.log('Usuarios cargados:', users);
            
            // Obtenemos el elemento html que vamos a rellenar
            const greeting = document.getElementById("user-greeting");
            // De todos los usuarios encontramos al que sea el propio
            const user = users.find(u => parseInt(u.id) === userId);

            // Si el usuario es el que se logeó entonces que nos de nuestro nombre 
            if (onlyMine && user && greeting) {
                greeting.textContent = `Fotos de ${user.username}`;
            } else if (greeting) {
                greeting.textContent = `Galería General`;
            }
            
            // Cargar galería con manejo de errores
            await loadGallery(users, onlyMine);
            
        } catch (error) {
            console.error('Error cargando datos:', error);
            M.toast({html: 'Error cargando datos del servidor', classes: 'red'});
        }
    }

    // Para ver la galería de los demás
    const btnGeneral = document.getElementById("btn-general");
    if (btnGeneral) {
        btnGeneral.addEventListener("click", () => {
            viewMyGallery = false;
            loadData(viewMyGallery);
            updateNavbarActive('li-general');
        });
    }

    const btnMisFotos = document.getElementById("btn-misfotos");
    if (btnMisFotos) {
        btnMisFotos.addEventListener("click", () => {
            viewMyGallery = true;
            loadData(viewMyGallery);
            updateNavbarActive('li-misfotos');
        });
    }

    // Botón de perfil
    const btnPerfil = document.getElementById("btn-perfil");
    if (btnPerfil) {
        btnPerfil.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "profile.html";
        });
    }

    // Inicializar uploader con callback para recargar galería
    initUploader(() => {
        loadData(viewMyGallery);
    });
    
    // Cargar datos iniciales
    loadData(false);
    
    // Verificar que el elemento existe antes de actualizar navbar
    setTimeout(() => {
        updateNavbarActive('li-general');
    }, 100);
});