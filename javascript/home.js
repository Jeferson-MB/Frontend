function loadGallery(users, onlyMine = false) {
    const myUserId = Number(localStorage.getItem("user_id"));
    const container = document.getElementById("gallery");

    container.innerHTML = '';

    fetch('http://localhost:5000/api/images')
    .then(res => res.json())
    .then(images => {
        images.forEach(img => {
            const isMine = Number(img.user_id) === myUserId;

            if (onlyMine && !isMine) return;
            if (!onlyMine && isMine) return;

            // Encuentra el uploader usando id numérico y muestra info para debug
            const uploader = users.find(u => Number(u.id) === Number(img.user_id));
            console.log({
                img_user_id: img.user_id,
                uploader_id: uploader ? uploader.id : null,
                uploader_username: uploader ? uploader.username : null,
                myUserId: myUserId
            });

            let uploaderHTML = '';
            if (uploader) {
                if (Number(uploader.id) === myUserId) {
                    uploaderHTML = '<strong>Tú</strong>';
                } else {
                    uploaderHTML = `<a class="profile-link" href="profile.html?user_id=${uploader.id}"><strong>${uploader.username}</strong></a>`;
                }
            } else {
                uploaderHTML = '<strong>Desconocido</strong>';
            }

            const card = document.createElement('div');
            card.className = 'col s12 m6 l4';
            card.innerHTML = `
                <div class='card hoverable z-depth-3'>
                    <div class='card-image'>
                        <img class='materialboxed' src='http://localhost:5000/static/uploads/${img.filename}' />
                    </div>
                    <div class='card-content'>
                        <span class='card-title'>Subido por: ${uploaderHTML}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        if (window.M && M.Materialbox) {
            M.Materialbox.init(document.querySelectorAll('.materialboxed'));
        }
    });
}

function loadData(onlyMine = false) {
    const myUserId = Number(localStorage.getItem("user_id"));
    if (!myUserId) window.location.href = './login.html';
    
    fetch('http://127.0.0.1:5000/api/users')
    .then(res => res.json())
    .then(users => {
        const greeting = document.getElementById("user-greeting");

        if (onlyMine) {
            const user = users.find(u => Number(u.id) === myUserId);
            if (user && greeting) {
                greeting.textContent = `Fotos de ${user.username}`;
            }
        } else {
            if (greeting) {
                greeting.textContent = `Galería General`;
            }
        }
        loadGallery(users, onlyMine);
    });
}

function updateNavbarActive(id) {
    const listItems = document.querySelectorAll(".nav-wrapper .right li");
    listItems.forEach(li => li.classList.remove('active'));
    const selectedLi = document.getElementById(id);
    if(selectedLi) {
        selectedLi.classList.add('active');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("imageInput");
    const fabUpload = document.getElementById("fab-upload");
    let viewMyGallery = true;

    fabUpload.addEventListener("click", () => {
        imageInput.click();
    });

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        const formData = new FormData();
        const userId = localStorage.getItem('user_id');
        formData.append('image', file);
        formData.append('user_id', userId);

        fetch('http://localhost:5000/api/images', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            loadData(viewMyGallery);
        });
    });

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

    // ¡CLAVE! Muestra la galería general al cargar la página
    loadData(false);
    updateNavbarActive('li-general');
});