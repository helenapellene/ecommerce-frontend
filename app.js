


class BaseDeDatos {
    constructor() {
      // Array de la base de datos
      this.productos = [];
      this.agregarRegistro(1, "Prosa completa", "Alejandra Pizarnik",7500,"prosaPiz.png");
      this.agregarRegistro(2, "Quien no","Claudia Piñero", 3000, "clau2.png");
      this.agregarRegistro(3, "Muerte en la vicaria","Agatha Chrstie", 6400, "agatha.png");
      this.agregarRegistro(4, "Catedrales","Claudia Piñeiro", 6000, "clau1.png");
      this.agregarRegistro(5, "Novelas breves", "Elena Garro", 4100, "garro.png");
      this.agregarRegistro(6, "Poesia Completa","Alejandra Pizarnik", 6500,"poesiaPiz.png");
      this.agregarRegistro(7, "La casa de los espiritus","Isabel Allende", 3000, "isabel.png");
      this.agregarRegistro(8, "Diarios","Alejandra Pizarnik", 7500, "diariosPiz.png");
      this.agregarRegistro(10, "Orlando","Virginia Woolf", 4500, "virgi.png");
    }
    // Método que crea el objeto producto y lo almacena en el array con un push
  agregarRegistro(id, nombre, autor, precio, imagen) {
    const producto = new Producto(id, nombre, autor, precio, imagen);
    this.productos.push(producto);
  }

  // Nos retorna el array con todos los productos de la base de datos
  traerRegistros() {
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
  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  // Agrega el producto al carrito
  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      // Si no esta, lo agregoa al carrito
      this.carrito.push({ ...producto, cantidad: 1 });
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


// Clase para los productos
class Producto {
  constructor(id, nombre, autor, precio, imagen = false) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.autor = autor;
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

// Llama a la función
cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
  divProductos.innerHTML = "";
  
  // Verificar si se ha realizado una búsqueda
  const palabra = inputBuscar.value.toLowerCase();
  const esBusqueda = palabra.length > 0;

  // Recorre todos los productos y lo agregamos al div #productos
  for (const producto of productos) {
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

  // Verifico si es una busqueda y oculto los elementos correspondientes
  if (esBusqueda) {
    divProductos.classList.add("hide");
    document.querySelector(".img-container").classList.add("hide");
    document.querySelector(".envios").classList.add("hide");
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
 
      carrito.agregar(producto);


      const contenedorNumerito = document.querySelector("#contenedor-numerito");

      contenedorNumerito.innerHTML="";

      const numero = document.createElement('p');
      contenedorNumerito.innerText=carrito.carrito.reduce( (acc,el) => acc += el.cantidad, 0)
      contenedorNumerito.appendChild(numero);
    });
  }
}

// // Buscador: al soltar una tecla se ejecuta el evento keyup
// inputBuscar.addEventListener("keyup", (event) => {
//   event.preventDefault();
//   // Obtiene el atributo value del input
//   const palabra = inputBuscar.value;
//   // Pide a nuestra base de datos que nos traiga todos los registros
//   // que coincidan con la palabra que pusimos en nuestro input
//   const productos = bd.registrosPorNombre(palabra.toLowerCase());
//   // Lo muestra en el HTML
//   cargarProductos(productos);
// });

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
function calcularTotal(){
  const total= carrito.carrito.reduce( (acc,el) => acc += el.cantidad, 0);
  console.log("total");
}