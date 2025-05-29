import { loadGallery } from "./gallery.js";
import { fetchUsers } from "./services/api.js";
import { updateNavbarActive } from "./services/utils.js";
import { initUploader } from "./uploader.js";

document.addEventListener("DOMContentLoaded", () => {
    let viewMyGallery = false;

    const userId = parseInt(localStorage.getItem('user_id'));
    if (!userId)
        return window.location.href = './login.html';

    function loadData(onlyMine = false) {
        fetchUsers()
        .then(users => {
            console.log(users);
            
            // Obtenemos el elemento html que vamos a rellenar
            const greeting = document.getElementById("user-greeting");
            // De todos los usuarios encontramos al que sea el propio
            const user = users.find(u => u.id === userId);

            // Si el usuario es el que se logeó entonces que nos de nuestro nombre 
            if (onlyMine && user && greeting) {
                greeting.textContent = `Fotos de ${user.username}`;
            } else if (greeting) {
                greeting.textContent = `Galería General`;
            }
            loadGallery(users, onlyMine);
        });
    };

    // Para ver la galería de los demás
    document.getElementById("btn-general").addEventListener("click", () => {
        viewMyGallery = false;
        loadData(viewMyGallery);
        updateNavbarActive('li-general');
    });

    document.getElementById("btn-misfotos").addEventListener("click", () => {
        viewMyGallery = true;
        loadData(viewMyGallery);
        updateNavbarActive('li-misfotos');
    });

    initUploader();
    loadData(false);
    updateNavbarActive('li-general');
});