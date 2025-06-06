import { loadGallery } from "./gallery.js";
import { fetchUsers } from "./services/api.js";
import { updateNavbarActive } from "./services/utils.js";
import { initUploader } from "./uploader.js";

document.addEventListener("DOMContentLoaded", async () => {
    const userId = parseInt(localStorage.getItem('user_id'));
    if (!userId) {
        window.location.href = './login.html';
        return;
    }

    let onlyMine = false;

    async function renderGallery() {
        const users = await fetchUsers();
        const greeting = document.getElementById("user-greeting");
        const user = users.find(u => u.id === userId);
        if (onlyMine && user && greeting) {
            greeting.textContent = `Fotos de ${user.username}`;
        } else if (greeting) {
            greeting.textContent = `Galería General`;
        }
        await loadGallery(users, onlyMine);
    }

    document.getElementById("btn-general").addEventListener("click", async (e) => {
        e.preventDefault();
        onlyMine = false;
        updateNavbarActive('li-general');
        await renderGallery();
    });

    document.getElementById("btn-misfotos").addEventListener("click", async (e) => {
        e.preventDefault();
        onlyMine = true;
        updateNavbarActive('li-misfotos');
        await renderGallery();
    });

    initUploader();

    onlyMine = false;
    updateNavbarActive('li-general');
    await renderGallery();
});