document.addEventListener('DOMContentLoaded', () => {

    // Función para eliminar producto
    document.querySelectorAll('[id^="delete-product-"]').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-productid');
            const cartId = event.target.getAttribute('data-cartid');
            console.log("PRODUCTOID: ", productId, "CARRITOID: ", cartId);

            if (!cartId || !productId) {
                console.error("Cart ID o Product ID no proporcionado");
                return;
            }

            try {
                const response = await fetch(`/api/cart/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    console.log("Producto eliminado correctamente");
                    location.reload();
                } else {
                    console.error("Error al eliminar el producto");
                }
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
            }
        });
    });

    // Función para vaciar carrito
    document.querySelectorAll('[id^="delete-cart-"]').forEach(button => {
        button.addEventListener('click', async (event) => {
            const cartId = event.target.getAttribute('data-cartid');
            console.log("CARRITO ID: ", cartId);

            if (!cartId) {
                console.error("Cart ID no proporcionado");
                return;
            }

            try {
                const response = await fetch(`/api/cart/${cartId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    console.log("Carrito vacío correctamente");
                    location.reload();
                } else {
                    console.error("Error al vaciar el carrito");
                }
            } catch (error) {
                console.error("Error al vaciar el carrito:", error);
            }
        });
    });

    // Función para actualizar la cantidad
    document.querySelectorAll('.update-quantity').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-productid');
            const cartId = event.target.getAttribute('data-cartid');
            const quantityInput = document.querySelector(`input[data-productid="${productId}"]`);
            const quantity = quantityInput.value;
            const stock = parseInt(quantityInput.getAttribute('max'));

            // Comparar cantidad con stock
            if (quantity > stock) {
                alert(`La cantidad solicitada (${quantity}) excede el stock disponible (${stock}).`);
                return; // Salir de la función si la cantidad excede el stock
            }
            console.log("PRODUCTOID: ", productId, "CARRITOID: ", cartId, "CANTIDAD: ", quantity);

            if (!cartId || !productId || !quantity) {
                console.error("Cart ID, Product ID o Quantity no proporcionado");
                return;
            }

            try {
                const response = await fetch(`/api/cart/${cartId}/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity }),
                });

                if (response.ok) {
                    console.log("Cantidad actualizada correctamente");
                    location.reload();
                } else {
                    console.error("Error al actualizar la cantidad");
                }
            } catch (error) {
                console.error("Error al actualizar la cantidad:", error);
            }
        });
    });

});