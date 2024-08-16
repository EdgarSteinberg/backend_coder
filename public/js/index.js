const socket = io();

// document.addEventListener('DOMContentLoaded', function () {

//     const formulario = document.getElementById('formulario');
//     if (formulario) {
//         formulario.addEventListener('submit', function (event) {
//             event.preventDefault();
//             const title = document.getElementById('title').value;
//             const description = document.getElementById('description').value;
//             const price = document.getElementById('price').value;
//             const code = document.getElementById('code').value;
//             const stock = document.getElementById('stock').value;
//             const category = document.getElementById('category').value;
//             const owner = document.getElementById('owner') ? document.getElementById('owner').value : "admin";
//             const thumbnail = document.getElementById('thumbnail').value;

//             const nuevoProducto = {
//                 title: title,
//                 description: description,
//                 price: price,
//                 code: code,
//                 stock: stock,
//                 category: category,
//                 owner: owner,
//                 thumbnail: thumbnail || []
//             };

//             socket.emit('nuevoProducto', nuevoProducto,);

//             Swal.fire({
//                 title: 'Producto agregado Correctamente',
//                 icon: 'success',
//                 confirmButtonText: 'Aceptar'
//             })//.then((result) => {
//             //     if (result.isConfirmed) {
//             //         window.location.href = '/realTimeProducts';
//             //     }
//             // });
//             document.getElementById('formulario').reset();

//         });


//         socket.on('productoAgregado', (nuevoProducto) => {
//             console.log('Datos del nuevo producto:', nuevoProducto);
//             const listaProductos = document.getElementById('listaProductos');
//             const nuevoElementoProducto = document.createElement('div');
//             nuevoElementoProducto.classList.add('productsFaker');
//             nuevoElementoProducto.id = nuevoProducto.id;
//             nuevoElementoProducto.innerHTML = `
//                 <h2>${nuevoProducto.title}</h2>
//                 <p>Descripción: ${nuevoProducto.description}</p>
//                 <p>Precio: $ ${nuevoProducto.price}</p>
//                 <p>Código: ${nuevoProducto.code}</p>
//                 <p>category: ${nuevoProducto.category}</p>
//                 <img src="/img/${nuevoProducto.thumbnail}" alt="${nuevoProducto.description}">

//                 <br>
//                 <button class="delete" data-productid="${nuevoProducto.id}" data-owner="${nuevoProducto.owner}">Eliminar</button>
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
//                 const owner = deleteButton.getAttribute('data-owner');
//                 const currentUserEmail = document.querySelector('.currentUserEmail').value;
//                 const currentUserRole = document.getElementById('currentUserRole').value;
//                 console.log('email', currentUserEmail)

//                 if (currentUserRole === 'admin' || owner === currentUserEmail) {
//                     Swal.fire({
//                         title: '¿Estás seguro de que deseas eliminar este producto?',
//                         text: 'Esta acción no se puede deshacer.',
//                         icon: 'warning',
//                         showCancelButton: true,
//                         confirmButtonText: 'Sí, eliminar',
//                         cancelButtonText: 'Cancelar'
//                     }).then((result) => {
//                         if (result.isConfirmed) {
//                             // Elimina el producto del DOM
//                             const productElement = deleteButton.closest('.products');
//                             if (productElement) {
//                                 productElement.remove();
//                                 console.log('Producto eliminado del DOM:', productId);
//                             } else {
//                                 console.error('El producto con ID', productId, 'no se encontró en el DOM.');
//                             }
//                             // Envía el ID del producto al servidor para eliminarlo
//                             socket.emit('eliminarProducto', productId);
//                             window.location.href = '/realTimeProducts'
//                         }
//                     });
//                 } else {
//                     Swal.fire({
//                         title: 'No tienes permiso para eliminar este producto.',
//                         icon: 'warning',
//                         confirmButtonText: 'Aceptar'
//                     })
//                 }
//             }
//         });
//     }
//  });


 document.addEventListener('DOMContentLoaded', function () {
    const listaProductos = document.getElementById('listaProductos');

    if (listaProductos) {
        // Recibir y mostrar un nuevo producto en tiempo real a través de WebSocket
        socket.on('productoAgregado', (nuevoProducto) => {
            console.log('Datos del nuevo producto:', nuevoProducto);

            // Verificar si el producto ya existe en la lista para evitar duplicados
            if (!document.getElementById(nuevoProducto.id)) {
                const nuevoElementoProducto = document.createElement('div');
                nuevoElementoProducto.classList.add('productsFaker');
                nuevoElementoProducto.id = nuevoProducto.id;
                nuevoElementoProducto.innerHTML = `
                    <h2>${nuevoProducto.title}</h2>
                    <p>Descripción: ${nuevoProducto.description}</p>
                    <p>Precio: $ ${nuevoProducto.price}</p>
                    <p>Código: ${nuevoProducto.code}</p>
                    <p>Categoría: ${nuevoProducto.category}</p>
                    <img src="/img/${nuevoProducto.thumbnail}" alt="${nuevoProducto.description}">
                    <br>
                    <button class="delete" data-productid="${nuevoProducto.id}" data-owner="${nuevoProducto.owner}">Eliminar</button>
                `;
                listaProductos.appendChild(nuevoElementoProducto);
            }
        });

        // Función para eliminar un producto
        listaProductos.addEventListener('click', function (event) {
            const deleteButton = event.target.closest('.delete');
            if (deleteButton) {
                const productId = deleteButton.getAttribute('data-productid');
                const owner = deleteButton.getAttribute('data-owner');
                const currentUserEmail = document.querySelector('.currentUserEmail').value;
                const currentUserRole = document.getElementById('currentUserRole').value;

                if (currentUserRole === 'admin' || owner === currentUserEmail) {
                    Swal.fire({
                        title: '¿Estás seguro de que deseas eliminar este producto?',
                        text: 'Esta acción no se puede deshacer.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            socket.emit('eliminarProducto', productId);

                            const productElement = deleteButton.closest('.productsFaker');
                            if (productElement) {
                                productElement.remove();
                                console.log('Producto eliminado del DOM:', productId);
                            } else {
                                console.error('El producto con ID', productId, 'no se encontró en el DOM.');
                            }
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'No tienes permiso para eliminar este producto.',
                        icon: 'warning',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }
        });
    }
});
