document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btnLogin');
  if (btnLogin) {
    btnLogin.addEventListener('click', (event) => {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const loader = document.getElementById('login-loader');
      if (loader) loader.style.display = 'block';

      fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then(async res => {
          const data = await res.json();
          if (loader) loader.style.display = 'none';
          if (res.status === 200 && data.user_id) {
            localStorage.setItem('user_id', data.user_id);
            M.toast({ html: data.mensaje, classes: 'green' });
            window.location.href = 'index.html';
          } else {
            M.toast({ html: data.error || 'Credenciales inválidas', classes: 'red' });
          }
        })
        .catch(error => {
          if (loader) loader.style.display = 'none';
          M.toast({ html: 'Error de conexión', classes: 'red' });
          console.error(error);
        });
    });
  }
});