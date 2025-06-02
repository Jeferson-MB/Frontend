function loadGallery(users, onlyMine = false) {
    const myUserId = Number(localStorage.getItem("user_id"));
    const container = document.getElementById("gallery");

    container.innerHTML = '';

    // Manda a traer las imágenes
    fetch('http://localhost:5000/api/images')
    .then(res => res.json())
    .then(images => {
        images.forEach(img => {
            // Pregunta si el usuario que subió la foto es el mismo que está logueado
            const isMine = Number(img.user_id) === myUserId;

            // Es para saber si la persona logueada es la misma de las fotos o no
            if (onlyMine && !isMine) return;
            if (!onlyMine && isMine) return;

            // Encontramos a la persona que cargó la imagen
            const uploader = users.find(u => u.id === Number(img.user_id));
            let uploaderHTML = '';
            if (uploader) {
                if (uploader.id === myUserId) {
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
        M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    });
}

function loadData(onlyMine = false) {
    const myUserId = Number(localStorage.getItem("user_id"));
    if (!myUserId)
        window.location.href = './login.html';
    
    fetch('http://127.0.0.1:5000/api/users')
    .then(res => res.json())
    .then(users => {
        console.log(users);
        
        // Obtenemos el elemento html que vamos a rellenar
        const greeting = document.getElementById("user-greeting");

        // Si el usuario es el que se logeó entonces que nos de nuestro nombre 
        if (onlyMine) {
            // De todos los usuarios encontramos al que sea el propio
            const user = users.find(u => u.id === myUserId);
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
    // Items o elementos li del navbar
    const listItems = document.querySelectorAll(".nav-wrapper .right li");
    listItems.forEach(li => {
        li.classList.remove('active');
    });
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

        // FormData crear diccionarios que llevan archivos
        const formData = new FormData();
        const userId = localStorage.getItem('user_id');
        // Empaquetando nuestra información en el FormData
        formData.append('image', file);
        formData.append('user_id', userId);

        fetch('http://localhost:5000/api/images', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log('Imagen subida:', data);
            loadData(viewMyGallery);
        });
    });

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

    loadData(false);
    updateNavbarActive('li-general');
});