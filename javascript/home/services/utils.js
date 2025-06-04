export function updateNavbarActive(id) {
    try {
        // Items o elementos li del navbar
        const listItems = document.querySelectorAll(".nav-wrapper .right li");
        listItems.forEach(li => {
            li.classList.remove('active');
        });
        
        const selectedLi = document.getElementById(id);
        if (selectedLi) {
            selectedLi.classList.add('active');
        } else {
            console.warn(`Elemento con ID '${id}' no encontrado en el navbar`);
        }
    } catch (error) {
        console.error('Error actualizando navbar:', error);
    }
}