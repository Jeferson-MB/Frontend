export function updateNavbarActive(id) {
    // Items o elementos li del navbar
    const listItems = document.querySelectorAll(".nav-wrapper .right li");
    listItems.forEach(li => {
        li.classList.remove('active');
    });
    const selectedLi = document.getElementById(id);
    selectedLi.classList.add('active');
}