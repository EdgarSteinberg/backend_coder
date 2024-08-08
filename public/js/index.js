const socket = io();


document.addEventListener('DOMContentLoaded', function () {

    const formulario = document.getElementById('formulario');
    if (formulario) {
        formulario.addEventListener('submit', function (event) {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const price = document.getElementById('price').value;
            const code = document.getElementById('code').value;
            const stock = document.getElementById('stock').value;
            const category = document.getElementById('category').value;
            const owner = document.getElementById('owner') ? document.getElementById('owner').value : "admin";

            const thumbnail = document.getElementById('thumbnail').value;

            const nuevoProducto = {
                title: title,
                description: description,
                price: price,
                code: code,
                stock: stock,
                category: category,
                owner: owner,
                thumbnail: thumbnail
            };


            socket.emit('nuevoProducto', nuevoProducto,);
            //socket.emit('nuevoProducto', nuevoProducto,user);
            document.getElementById('formulario').reset();
        });

        socket.on('productoAgregado', (nuevoProducto) => {
            console.log('Datos del nuevo producto:', nuevoProducto);
            const listaProductos = document.getElementById('listaProductos');
            const nuevoElementoProducto = document.createElement('div');
            nuevoElementoProducto.classList.add('products');
            nuevoElementoProducto.id = nuevoProducto.id;
            nuevoElementoProducto.innerHTML = `
                <h2>${nuevoProducto.title}</h2>
                <p>Descripción: ${nuevoProducto.description}</p>
                <p>Precio: $ ${nuevoProducto.price}</p>
                <p>Código: ${nuevoProducto.code}</p>
                <p>category: ${nuevoProducto.category}</p>
                <img src="${nuevoProducto.thumbnail}" alt="${nuevoProducto.description}">
                
                <br>
                <button class="delete" data-productid="${nuevoProducto.id}" >Eliminar</button>
            `;
            listaProductos.appendChild(nuevoElementoProducto);
        });
    } 
    const listaProductos = document.getElementById('listaProductos');
    if (listaProductos) {
        listaProductos.addEventListener('click', function (event) {
            const deleteButton = event.target.closest('.delete');
            if (deleteButton) {
                const productId = deleteButton.getAttribute('data-productid');
                const owner = deleteButton.getAttribute('data-owner');
                const currentUserEmail = document.querySelector('.currentUserEmail').value;
                const currentUserRole = document.getElementById('currentUserRole').value;
                console.log('emial', currentUserEmail)
                if (currentUserRole === 'admin' || owner === currentUserEmail) {
                    // Permite la eliminación si el usuario es admin o el propietario del producto
                    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                        // Elimina el producto del DOM
                        const productElement = deleteButton.closest('.products');
                        if (productElement) {
                            productElement.remove();
                            console.log('Producto eliminado del DOM:', productId);
                        } else {
                            console.error('El producto con ID', productId, 'no se encontró en el DOM.');
                        }
                        // Envía el ID del producto al servidor para eliminarlo
                        socket.emit('eliminarProducto', productId);
                    }
                } else {
                    alert('No tienes permiso para eliminar este producto.');
                }
            }
        });
    }
});

// document.addEventListener('DOMContentLoaded', function () {

//     const formulario = document.getElementById('formulario');
//     if (formulario) {
//         formulario.addEventListener('submit', function (event) {
//             event.preventDefault();

//             // Crear un objeto FormData para manejar archivos
//             const formData = new FormData(formulario);

//             // Extraer los datos del formulario
//             const nuevoProducto = {
//                 title: formData.get('title'),
//                 description: formData.get('description'),
//                 price: formData.get('price'),
//                 code: formData.get('code'),
//                 stock: formData.get('stock'),
//                 category: formData.get('category'),
//                 owner: formData.get('owner') || "admin"
//             };

//             // Obtener archivos de thumbnail
//             const archivos = formData.getAll('thumbnail');

//             // Leer archivos y convertir a URL de datos
//             const readerPromises = archivos.map((file) => {
//                 return new Promise((resolve) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => resolve(reader.result);
//                     reader.readAsDataURL(file);
//                 });
//             });

//             // Esperar a que todos los archivos sean leídos
//             Promise.all(readerPromises).then((fileURLs) => {
//                 // Agregar las URLs de los archivos al objeto nuevoProducto
//                 nuevoProducto.thumbnail = fileURLs;

//                 // Emitir el producto nuevo por WebSocket
//                 socket.emit('nuevoProducto', nuevoProducto);

//                 // Restablecer el formulario
//                 formulario.reset();
//             });
//         });

//         socket.on('productoAgregado', (nuevoProducto) => {
//             console.log('Datos del nuevo producto:', nuevoProducto);
//             const listaProductos = document.getElementById('listaProductos');
//             const nuevoElementoProducto = document.createElement('div');
//             nuevoElementoProducto.classList.add('products');
//             nuevoElementoProducto.id = nuevoProducto.id;

//             // Crear el HTML para las imágenes
//             const thumbnailsHTML = nuevoProducto.thumbnail.map((url) => `<img src="${url}" alt="Imagen del producto">`).join('');

//             nuevoElementoProducto.innerHTML = `
//                 <h2>${nuevoProducto.title}</h2>
//                 <p>Descripción: ${nuevoProducto.description}</p>
//                 <p>Precio: $ ${nuevoProducto.price}</p>
//                 <p>Código: ${nuevoProducto.code}</p>
//                 <p>Categoría: ${nuevoProducto.category}</p>
//                 ${thumbnailsHTML}
//                 <br>
//                 <button class="delete" data-productid="${nuevoProducto.id}">Eliminar</button>
//             `;
//             listaProductos.appendChild(nuevoElementoProducto);
//         });
//     }
//     const listaProductos = document.getElementById('listaProductos');
//     if (listaProductos) {
//         listaProductos.addEventListener('click', function (event) {
//             const deleteButton = event.target.closest('.delete');
//             if (deleteButton) {
//                 const productId = deleteButton.getAttribute('data-productid');
//                 const productElement = deleteButton.closest('.products');
//                 if (productElement) {
//                     productElement.remove();
//                     console.log('Producto eliminado del DOM:', productId);
//                 } else {
//                     console.error('El producto con ID', productId, 'no se encontró en el DOM.');
//                 }
//                 socket.emit('eliminarProducto', productId);
//             }
//         });
//     }
// });

// document.addEventListener('DOMContentLoaded', function () {
//     const addToCartButtons = document.querySelectorAll('.agregar');

//     addToCartButtons.forEach(button => {
//         button.addEventListener('click', async (event) => {
//             const productId = button.getAttribute('data-productid'); // Obtener el ID del producto desde el atributo data-productid del botón
//             console.log('Producto ID:', productId);
//             try {
//                 // Emitir un evento para agregar el producto al carrito
//                 socket.emit('agregarProductoAlCarrito', { productId });
//             } catch (error) {
//                 console.error('Error al enviar la solicitud:', error);
//                 alert('Error al conectar con el servidor');
//             }
//         });
//     });

//     socket.on('productoAgregadoAlCarrito', () => {
//         Swal.fire({
//             title: "¡Producto agregado al carrito!",
//             text: "¡Excelente elección!",
//             icon: "success"
//         });
//     });
//});



