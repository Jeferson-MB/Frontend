import { URI } from "../../uri.js";

const URL = URI + '/api';

// Export: Hace que pueda llamarse desde otros archivos de javascript
// Async: Hace a la función asincrona
export async function fetchUsers() {
    try {
        const res = await fetch(`${URL}/users`);
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        const users = await res.json();
        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function fetchImages() {
    try {
        // Intentar diferentes endpoints posibles
        let res;
        const possibleEndpoints = [
            `${URL}/images`,
            `${URL}/image`,
            `${URL}/gallery`,
            `http://localhost:5000/api/images`,
            `http://127.0.0.1:5000/api/images`
        ];
        
        let lastError;
        for (const endpoint of possibleEndpoints) {
            try {
                console.log(`Intentando endpoint: ${endpoint}`);
                res = await fetch(endpoint);
                if (res.ok) {
                    console.log(`Endpoint exitoso: ${endpoint}`);
                    break;
                }
            } catch (err) {
                lastError = err;
                continue;
            }
        }
        
        if (!res || !res.ok) {
            console.error('Ningún endpoint de imágenes funcionó');
            console.log('Endpoints probados:', possibleEndpoints);
            throw new Error(`Error HTTP: ${res?.status || 'No se pudo conectar'}`);
        }
        
        const images = await res.json();
        return Array.isArray(images) ? images : [];
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
}

export async function uploadImage(file, userId) {
    try {
        const formData = new FormData();
        // Empaquetando nuestra información en el FormData
        formData.append('image', file);
        formData.append('user_id', userId);

        const res = await fetch(`${URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

export async function fetchComments(imageId, userId, text) {
    try {
        const res = await fetch(`${URL}/comment/${imageId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                user_id: userId,
                comment: text
            })
        });

        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error;
    }
}