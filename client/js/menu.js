// Obtener referencias a elementos del DOM
const openMenu = document.querySelector("#open-menu");
const closeMenu = document.querySelector("#close-menu");
const aside = document.querySelector("aside");

// Agregar un evento de escucha al botón "openMenu" para mostrar el menú
openMenu.addEventListener("click", () => {
    aside.classList.add("aside-visible");
})

// Agregar un evento de escucha al botón "closeMenu" para ocultar el menú
closeMenu.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
})
