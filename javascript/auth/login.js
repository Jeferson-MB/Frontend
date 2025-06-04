// javascript/login/login.js

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Credenciales inválidas');
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem('token', data.token);
          window.location.href = '../home/home.html';
        })
        .catch((error) => {
          console.error('Error en el inicio de sesión:', error);
          alert('Error de inicio de sesión');
        });
    });
  } else {
    console.error('Formulario login no encontrado');
  }
});

