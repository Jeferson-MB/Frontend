import { URI } from "../../uri.js";

const URL =  URI + '/api';

// Export: Hace que pueda llamarse desde otros archivos de javascript
// Async: Hace a la función asincrona
export async function fetchUsers() {
    const res = await fetch(`${URL}/users`);
    return res.json();
}

export async function fetchImages() {
    const res = await fetch(`${URL}/images`);
    return res.json();
}

export async function uploadImage(file, userId) {
    const formData = new FormData();
    // Empaquetando nuestra información en el FormData
    formData.append('image', file);
    formData.append('user_id', userId);

    const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
    });

    return res.json();
}

export async function fetchComments(imageId, userId, text) {
    const res = await fetch(`http://localhost:5000/api/comment/${imageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            comment: text
        })
    });

    return res.json();
}
