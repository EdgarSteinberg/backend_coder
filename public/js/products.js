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
                    title: "¡El producto no está disponible!",
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
               //const response = await fetch(`/api/cart/${cartId}/products/${productId}`, {
                const response = await fetch(`https://backend-coder-va89.onrender.com/api/cart/${cartId}/products/${productId}`,{  
               method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, productId, quantity })
                });

                if (response.ok) {
                    Swal.fire({
                        title: "¡Producto agregado al carrito!",
                        icon: "success",
                        html: `
                          <a id="continueShopping" class="swal2-styled" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;" href="/products">Seguir comprando</a>
                          <a id="completePurchase" class="swal2-styled" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-left: 10px;" href="/carts/${cartId}">Termina tu compra</a>
                        `,
                        showConfirmButton: false // Opcional: Oculta el botón de confirmación de SweetAlert
                    }).then(() => {
                        // Opcional: Puedes manejar el enlace aquí si es necesario
                        const redirectLink = document.getElementById('redirectLink');
                        if (redirectLink) {
                            redirectLink.click(); // Redirige automáticamente si quieres hacerlo aquí
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
