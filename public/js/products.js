document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.agregar').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-productid');
            const cartId = event.target.getAttribute('data-cartid');
            const userId = event.target.getAttribute('data-userid');
            const quantityInput = document.querySelector(`input[data-productid="${productId}"]`);
            const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;
            const stock = parseInt(button.getAttribute('data-stock'), 10);

            console.log("Carrito ID:", cartId);
            console.log("Producto ID:", productId);
            console.log("Usuario ID:", userId);
            console.log("Cantidad seleccionada:", quantity);


            if (stock === 0) {
                Swal.fire({
                    title: "¡El producto no está disponible en stock!",
                    icon: "error"
                });
                //alert('El producto no está disponible en stock.');
                button.textContent = 'Sin stock';
                button.disabled = true;
                return; // Detener la ejecución si el stock es 0
            }

            if (!cartId || !productId || !userId) {
                console.error('ID del carrito, del producto o del usuario no proporcionado');
                return;
            }

            try {
                const response = await fetch(`/api/cart/${cartId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, productId, quantity })
                });

                const result = await response.json();
                if (response.ok) {
                    Swal.fire({
                        title: "¡Producto agregado al carrito!",
                        icon: "success"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Redirige al usuario para terminar la compra
                            // window.location.href = `/carts/${cartId}`; // Cambia la URL si es necesario
                            button.textContent = 'Terminar Compra'
                            button.addEventListener('click', () => {
                                window.location.href = `/carts/${cartId}`;
                            });
                        } else {
                            // Cambia el texto del botón
                            button.textContent = 'Añadido al carrito';
                            button.disabled = true; // Opcional: Desactivar el botón después de agregar al carrito
                        }
                    });
                    console.log('Producto agregado al carrito:', result);
                } else {
                    console.error('Error al agregar el producto al carrito:', result.message);
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        });
    });
});
