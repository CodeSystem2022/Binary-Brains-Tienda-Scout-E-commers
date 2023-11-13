// Inicializar un array vacío para almacenar los productos
import { productos } from "./products.js";

// Obtener referencias a elementos del DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// Ocultar un elemento con la clase "aside-visible" cuando se hace clic en botones de categoría
botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

// Función para cargar y mostrar productos en el contenedor de productos
function cargarProductos(productos) {

    // Limpiar el contenedor de productos
    contenedorProductos.innerHTML = "";

    productos.forEach((producto) => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}
cargarProductos(productos);
// Manejar clic en los botones de categoría
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        // Cambiar la clase "active" para resaltar el botón de categoría seleccionado
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            // Filtrar productos por categoría y actualizar la vista
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            // Mostrar todos los productos si se selecciona la categoría "todos"
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

// Función para actualizar los botones "Agregar" en la página
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

// Inicializar un array para almacenar productos en el carrito de compras
let productosEnCarrito;

// Obtener productos en el carrito desde el almacenamiento local, si existen
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    if (!Array.isArray(productosEnCarrito)) {
        productosEnCarrito = [];
    }
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}
// Función para agregar un producto al carrito
function agregarAlCarrito(e) {
    // Mostrar una notificación de producto agregado
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` o `bottom`
        position: "right", // `left`, `center` o `right`
        stopOnFocus: true, // Evita el cierre de la notificación al pasar el cursor sobre ella
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // Eje horizontal - puede ser un número o una cadena que indique unidad. Ejemplo: '2em'
            y: '1.5rem' // Eje vertical - puede ser un número o una cadena que indique unidad. Ejemplo: '2em'
        },
        onClick: function () {} // Devolución de llamada después de hacer clic en la notificación
    }).showToast();

     // Obtener el ID del producto desde el botón "Agregar" que se hizo clic
     const idBoton = parseInt(e.currentTarget.id, 10);

    // Buscar el producto en el array de productos
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    // Verificar si el productoAgregado es válido
    if (!productoAgregado) {
        console.error("Producto no encontrado:", idBoton);
        console.error("Productos en el carrito:", productosEnCarrito);
        return;
    }

    // Buscar si el producto ya está en el carrito
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    if (index !== -1) {
        // Si el producto ya está en el carrito, aumentar su cantidad
        productosEnCarrito[index].quanty++;
    } else {
        // Si es un producto nuevo, agregarlo al carrito con cantidad 1
        productosEnCarrito.push({ ...productoAgregado, quanty: 1 });
    }

    // Actualizar el número en el icono del carrito
    actualizarNumerito();

    // Guardar los productos en el carrito en el almacenamiento local
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    console.log("Productos en el carrito:", productosEnCarrito);
    console.log("Almacenamiento local:", localStorage.getItem("productos-en-carrito"));
}

function actualizarNumerito() {
    try {
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => {
            if (!producto || !producto.quanty) {
                console.error("Elemento de carrito sin cantidad:", producto);
                return acc;
            }
            return acc + producto.quanty;
        }, 0);
        numerito.innerText = nuevoNumerito;
    } catch (error) {
        console.error("Error al actualizar el numerito:", error);
    }
}