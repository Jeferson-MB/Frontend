const URL = "http://localhost:5000/api";

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
    formData.append('image', file);
    formData.append('user_id', userId);

    const res = await fetch(`${URL}/upload`, {
        method: 'POST',
        body: formData
    });

    return res.json();
}

export async function postComment(imageId, userId, text) {
    const res = await fetch(`${URL}/comment/${imageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            comment: text
        })
    });
    return res.json();
}