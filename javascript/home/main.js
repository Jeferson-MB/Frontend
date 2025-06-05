import { loadGallery } from "./gallery.js";
import { fetchUsers } from "./services/api.js";
import { updateNavbarActive } from "./services/utils.js";
import { initUploader } from "./uploader.js";

document.addEventListener("DOMContentLoaded", () => {
    let viewMyGallery = false;

    const userId = parseInt(localStorage.getItem('user_id'));
    if (!userId) {
        window.location.href = './login.html';
        return;
    }

    function loadData(onlyMine = false) {
        fetchUsers()
        .then(users => {
            const greeting = document.getElementById("user-greeting");
            const user = users.find(u => u.id === userId);

            if (onlyMine && user && greeting) {
                greeting.textContent = `Fotos de ${user.username}`;
            } else if (greeting) {
                greeting.textContent = `Galería General`;
            }
            loadGallery(users, onlyMine);
        });
    };

    document.getElementById("btn-general").addEventListener("click", (e) => {
        e.preventDefault();
        viewMyGallery = false;
        loadData(viewMyGallery);
        updateNavbarActive('li-general');
    });

    document.getElementById("btn-misfotos").addEventListener("click", (e) => {
        e.preventDefault();
        viewMyGallery = true;
        loadData(viewMyGallery);
        updateNavbarActive('li-misfotos');
    });

    initUploader();
    loadData(false);
    updateNavbarActive('li-general');
});