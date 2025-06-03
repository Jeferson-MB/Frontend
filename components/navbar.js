const navbar = document.getElementById('navbar');
navbar.innerHTML = `
  <nav class="blue darken-4">
    <div class="nav-wrapper">
      <a href="/" class="brand-logo" style="padding-left: 20px;">MyPinterest</a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a href="/gallery">Galería general</a></li>
        <li><a href="/my-gallery">Mi galería</a></li>
        <li><a href="/profile">Perfil</a></li>
        <li><a href="/logout">Cerrar Sesión</a></li>
      </ul>
    </div>
  </nav>
`;

