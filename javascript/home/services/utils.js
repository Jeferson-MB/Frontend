// utils.js
function updateNavbarActive(activeId) {
    // Esperar a que el custom element se haya renderizado
    setTimeout(() => {
        // Remover clase active de todos los elementos li del navbar
        const navItems = document.querySelectorAll('#nav-mobile li');
        navItems.forEach(item => item.classList.remove('active'));
        
        // Agregar clase active al elemento seleccionado
        const activeElement = document.getElementById(activeId);
        if (activeElement) {
            activeElement.classList.add('active');
            console.log(`Navbar activo: ${activeId}`);
        } else {
            console.warn(`Elemento con ID '${activeId}' no encontrado en el navbar`);
            // Debug: mostrar todos los IDs disponibles
            const availableIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
            console.log('IDs disponibles:', availableIds);
        }
    }, 100); // Pequeño delay para asegurar que el DOM esté listo
}

// Función alternativa que usa selectores más específicos
function updateNavbarActiveByHref(currentPath) {
    setTimeout(() => {
        // Remover clase active de todos los li
        const navItems = document.querySelectorAll('#nav-mobile li');
        navItems.forEach(item => item.classList.remove('active'));
        
        // Encontrar el enlace que coincide con la ruta actual
        const activeLink = document.querySelector(`#nav-mobile a[href="${currentPath}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
            console.log(`Navbar activo por href: ${currentPath}`);
        }
    }, 100);
}

// Función para inicializar el navbar activo basado en la URL actual
function initNavbarActive() {
    const currentPath = window.location.pathname;
    updateNavbarActiveByHref(currentPath);
}

// Auto-inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que los custom elements se registren
    setTimeout(initNavbarActive, 200);
});

// También ejecutar cuando cambie la URL (para SPAs)
window.addEventListener('popstate', initNavbarActive);