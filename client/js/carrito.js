// Obtener los productos en el carrito desde el almacenamiento local
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

// Obtener referencias a elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Función para cargar los productos en el carrito en la página
function cargarProductosCarrito() {
  if (productosEnCarrito && productosEnCarrito.length > 0) {
    // Mostrar los elementos relacionados con el carrito
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");

    // Limpiar la sección de productos en el carrito
    contenedorCarritoProductos.innerHTML = "";

    // Recorrer los productos en el carrito y mostrarlos en la página
    productosEnCarrito.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
                <img class="carrito-producto-imagen" src="${
                  producto.imagen
                }" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.quanty}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.quanty}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${
                  producto.id
                }"><i class="bi bi-trash-fill"></i></button>
            `;

      contenedorCarritoProductos.append(div);
    });

    actualizarBotonesEliminar();
    actualizarTotal();
  } else {
    // Si el carrito está vacío, mostrar un mensaje apropiado
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
  }
}

// Llamar a la función para cargar los productos en el carrito al cargar la página
cargarProductosCarrito();

// Función para actualizar los botones de eliminación de productos
function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
  // Mostrar una notificación de eliminación
  Toastify({
    text: "Producto eliminado",
    duration: 3000,
    close: true,
    gravity: "top", // `top` o `bottom`
    position: "right", // `left`, `center` o `right`
    stopOnFocus: true, // Evita el cierre de la notificación al pasar el cursor sobre ella
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem", // Eje horizontal - puede ser un número o una cadena que indique la unidad. Ejemplo: '2em'
      y: "1.5rem", // Eje vertical - puede ser un número o una cadena que indique la unidad. Ejemplo: '2em'
    },
    onClick: function () {}, // Devolución de llamada después de hacer clic en la notificación
  }).showToast();

  // Obtener el ID del producto a eliminar
  const idBoton = e.currentTarget.id;

  // Encontrar el índice del producto en el carrito
  const index = productosEnCarrito.findIndex(
    (producto) => producto.id === idBoton
  );

  // Eliminar el producto del carrito
  productosEnCarrito.slice(index, 1);

  // Volver a cargar los productos en el carrito
  cargarProductosCarrito();

  // Actualizar los datos del carrito en el almacenamiento local
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

// Manejar el evento de vaciar el carrito
botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
  // Mostrar un mensaje de confirmación para vaciar el carrito
  Swal.fire({
    title: "¿Estás seguro?",
    icon: "question",
    html: `Se van a borrar ${productosEnCarrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    )} productos.`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      // Vaciar el carrito y actualizar el almacenamiento local
      productosEnCarrito.length = 0;
      localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
      );
      cargarProductosCarrito();
    }
  });
}

// Función para actualizar el total del carrito
function actualizarTotal() {
  const totalCalculado = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.precio * producto.quanty,
    0
  );
  contenedorTotal.innerText = `$${totalCalculado}`;
  return totalCalculado;
}

const total = actualizarTotal();
console.log(total);


// function reemplazarBoton() {
//   // Crear un nuevo botón
//   var nuevoBoton = document.createElement("button");
//   nuevoBoton.innerHTML = "";
//   nuevoBoton.onclick = reemplazarBoton; // Asignar la misma función al nuevo botón

//   // Obtener el botón original
//   var botonOriginal = document.getElementById("carrito-acciones-comprar");

//   // Reemplazar el botón original con el nuevo botón
//   botonOriginal.parentNode.replaceChild(nuevoBoton, botonOriginal);
// }

const mercadopago = new MercadoPago(
    "TEST-f356d53f-5cf1-4c51-af9b-eeae3d4b4c0f",
    {
      locale: "es-AR",
    }
  );
// Manejar el evento de compra del carrito

botonComprar.addEventListener("click", () => {
    const orderData = {
      quanty: 1,
      description: "Compra de ecomerce",
      price: total,
    };
  
    fetch("http://localhost:8080/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (preference) {
        createCheckoutButton(preference.id);
      })
      .catch(function () {
        alert("Algo Salio Mal");
      });
  });
  
  function createCheckoutButton(preferenceId) {
    const bricksBuilder = mercadopago.bricks(); // Usar MercadoPago directamente
  
    const renderComponent = async (bricksBuilder) => {
      await bricksBuilder.create("wallet", "carrito-acciones-comprar", {
        initialization: {
          preferenceId: preferenceId,
        },
        callbacks: {
          onError: (error) => console.error(error),
          onReady: () => {},
        },
      });
  
    };
  
    window.checkoutButton = renderComponent(bricksBuilder);
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
  };
  window.checkoutButton = renderComponenr(bricksBuilder);
  contenedorCarritoVacio.classList.add("disabled");
  contenedorCarritoProductos.classList.add("disabled");
  contenedorCarritoAcciones.classList.add("disabled");
  contenedorCarritoComprado.classList.remove("disabled");
