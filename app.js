class BaseDeDatos {
  constructor() {
    // Array de la base de datos
    this.productos = [];
  }
  // Nos retorna el array con todos los productos de la base de datos
  async traerRegistros() {
    const response = await fetch('./productos.json');
    this.productos = await response.json();
    return this.productos;
  }

  // Busca un producto por ID, si lo encuentra lo retorna en forma de objeto
  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  // Retorna una lista (array) de productos que incluyan en el nombre los caracteres
  // que le pasemos por parámetro.
  registrosPorNombre(palabra) {
    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(palabra) || producto.autor.toLowerCase().includes(palabra));
  }

  registrosPorCategoria(categoria) {
    return this.productos.filter((producto) => producto.categoria == categoria);

  }

  registrosNovedades() {
    return this.productos.filter((producto) => producto.esNov === true);
  }



}



// Clase carrito
class Carrito {
  constructor() {
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.totalProductos = 0;
    this.listar();
  }




  // Verificamos si el producto está en el carrito. 
  estaEnCarrito(producto) {
    return this.carrito.find((p) => p.id === producto.id);
  }

  // Agrega el producto al carrito
  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      // Si no esta, lo agregoa al carrito
      this.carrito.push({
        ...producto,
        cantidad: 1
      });
    }
    // Actualizo el storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    // Actualizo el carrito en el HTML
    this.listar();
    calcularTotal();
  }

  // Método para quitar o restar productos del carrito
  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
    }
    // Actualizo el storage
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    // Actualizo el carrito en el HTML
    this.listar();
  }


  vaciar() {
    this.carrito = [];
    localStorage.removeItem("carrito");
    this.listar();
  }


  // Este método es el encargado de actualizar el HTML de nuestro carrito
  listar() {
    // Reiniciamos las variables
    this.total = 0;
    this.totalProductos = 0;
    divCarrito.innerHTML = "";

    // Recorre todos los productos del carrito y lo agregamos al div #carrito
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
        <div class="productoCarrito">
            <h2>${producto.nombre}</h2>
            <span>${producto.autor}</span>
            <p>$${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <a href="#" data-id="${producto.id}" class="btnQuitar">Quitar del carrito</a>
            </div>
            <div>
            
            </div>
    `;
      // Actulizza los totales
      this.total += producto.precio * producto.cantidad;
      this.totalProductos += producto.cantidad;



    }

    // Actualiza el total en el HTML
    document.querySelector("#totalCarrito").innerText = this.total;

    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.onclick = (event) => {
        event.preventDefault();
        this.quitar(Number(boton.dataset.id));
      };
    }
    // // Actualizam variables carrito
    // spanCantidadProductos.innerText = this.totalProductos;
    // spanTotalCarrito.innerText = this.total;
  }
}


class Producto {
  constructor(id, nombre, autor, precio, categoria, esNov = false, imagen = false) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.autor = autor;
    this.categoria = categoria;
    this.esNov = esNov;
    this.imagen = imagen;
  }
}

// Objeto de la base de datos
const bd = new BaseDeDatos();

// Elementos
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("#carrdesp");
const botonComprar = document.querySelector("#btnComprar");
const botonCat = document.querySelectorAll(".btnCat");

// Agregamos el evento "click" a cada botón de categoría
botonCat.forEach((boton) => {
  boton.addEventListener("click", (event) => {
    event.preventDefault();

    // Removemos la clase "seleccionado" de cualquier botón seleccionado previamente
    const botonSeleccionado = document.querySelector(".seleccionado");
    if (botonSeleccionado) {
      botonSeleccionado.classList.remove("seleccionado");
    }

    // Añadimos la clase "seleccionado" al botón que fue clickeado
    boton.classList.add("seleccionado");

    // Obtenemos la categoría seleccionada del atributo "data-categoria"
    const categoria = boton.dataset.categoria;

    // Filtramos los productos por categoría y mostramos solo los productos de esa categoría
    const productosPorCategoria = bd.registrosPorCategoria(categoria);
    cargarProductos(productosPorCategoria);


    // Ocultar el img-container y el #Novedades cuando se filtra por categoría
    document.getElementById("imgContainer").style.display = "none";
    document.getElementById("Novedades").style.display = "none";
  });
});

// Función para mostrar nuevamente el img-container y el #Novedades cuando se muestren todos los productos
function mostrarImagenYTitulo() {
  document.getElementById("imgContainer").style.display = "block";
  document.getElementById("Novedades").style.display = "block";
}


// Llama a la función
bd.traerRegistros().then(
  (productos) => cargarProductos(productos));
mostrarImagenYTitulo

function cargarProductos(productos) {
  divProductos.innerHTML = "";

  // Filtramos los productos por novedades (esNov === true) primero
  const productosNovedades = productos.filter((producto) => producto.esNov === true);
  // const productosNoNovedades = productos.filter((producto) => producto.esNov === false);
  // const productosOrdenados = [...productosNovedades, ...productosNoNovedades];

  // Verificar si se ha realizado una búsqueda
  const palabra = inputBuscar.value.toLowerCase();
  const esBusqueda = palabra.length > 0;

  const categoriaSeleccionada = document.querySelector(".seleccionado");

  let productosFiltrados;

  if (esBusqueda) {
    // Filtrar productos por nombre
    productosFiltrados = bd.registrosPorNombre(palabra);
  } else if (categoriaSeleccionada) {
    // Filtrar productos por categoría
    const categoria = categoriaSeleccionada.dataset.categoria;
    productosFiltrados = bd.registrosPorCategoria(categoria);
  } else {
    // Mostrar solo los productos con esNov: true al inicio del sitio
    productosFiltrados = productosNovedades;
  }

  // Recorre todos los productos y los agregamos al div #productos
  for (const producto of productosFiltrados) {
    divProductos.innerHTML += `
    <div class="producto">
      <h2>${producto.nombre}</h2>
      <span>${producto.autor}</span>
      <div class="imagen">
        <img src="assets/${producto.imagen}" />
      </div>
      <p class="precio">$${producto.precio}</p>
      <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
    </div>
  `;
  }

  // Verifico si es una búsqueda y oculto los elementos correspondientes
  if (esBusqueda) {
    divProductos.classList.add("hide");
    document.querySelector(".img-container").classList.add("hide");
    document.querySelector(".envios").classList.add("hide");
    document.querySelector("#Novedades").classList.add("hide");
  } else {
    divProductos.classList.remove("hide");
    document.querySelector(".img-container").classList.remove("hide");
    document.querySelector(".envios").classList.remove("hide");
    document.querySelector("#Novedades").classList.remove("hide");
  }

  const botonesAgregar = document.querySelectorAll(".btnAgregar");
  for (const boton of botonesAgregar) {
    // Le agrega un evento click a cada uno
    boton.addEventListener("click", (event) => {
      event.preventDefault();

      const id = Number(boton.dataset.id);
      const producto = bd.registroPorId(id);

      // Verificar si el producto existe
      if (producto) {
        carrito.agregar(producto);

        const contenedorNumerito = document.querySelector("#contenedor-numerito");
        contenedorNumerito.innerHTML = "";

        const numero = document.createElement('p');
        contenedorNumerito.innerText = carrito.carrito.reduce((acc, el) => acc += el.cantidad, 0)
        contenedorNumerito.appendChild(numero);
      }
    });
  }
}



// Buscador: al presionar el boton de busqueda se ejecuta el evento 
botonBuscar.addEventListener("click", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  const productos = bd.registrosPorNombre(palabra.toLowerCase());
  cargarProductos(productos);
});

// Buscador: al presionar la tecla ENTER se ejecuta el evento 
inputBuscar.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    const palabra = inputBuscar.value;
    const productos = bd.registrosPorNombre(palabra.toLowerCase());
    cargarProductos(productos);
  }
});


botonCarrito.addEventListener("click", (event) => {
  document.querySelector("#carrdesp").classList.toggle("ocultar");
});

const carrito = new Carrito();


botonComprar.addEventListener("click", (event) => {
  event.preventDefault();
  Swal.fire({
    title: "Su pedido está en camino",
    text: "¡Su compra ha sido realizada con éxito!",
    icon: "success",
    confirmButtonText: "Aceptar",
    customClass: {
      confirmButton: 'mi-clase-personalizada' // Reemplaza 'mi-clase-personalizada' con el nombre de tu clase CSS
    }
  });
  // Vacíamos el carrito
  carrito.vaciar();
  // Ocultamos el carrito en el HTML
  document.querySelector("#carrdesp").classList.add("ocultar");
});

//intento de total jaj
function calcularTotal() {
  const total = carrito.carrito.reduce((acc, el) => acc += el.cantidad, 0);
  console.log("total");
}