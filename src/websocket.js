import { ProductController } from "./controllers/productController.js";
import { MessagesController } from "./controllers/messageController.js";
import { CartController } from "./controllers/cartController.js";
import { userController } from "./controllers/userController.js";
const Manager = new ProductController();
const Message = new MessagesController();
const CartManager = new CartController();
const userManager = new userController();
const SECRET_KEY = process.env.SECRET_KEY;
export default (io) => {
    io.on("connection", (socket) => {
        //console.log("Nuevo cliente conectado ------>", socket.id);


        socket.on("nuevoProducto", async data => {
            console.log("Recibido nuevo producto: ", data);
            //const user = await UserManager.getById(user)
            const newProduct = await Manager.createProduct(data);
            // Agregar el ID generado al objeto de datos antes de emitir el evento
            const dataWithID = { id: newProduct.id, ...data };

            console.log("Producto enviado al cliente: ", dataWithID);

            socket.emit("productoAgregado", dataWithID);
        });

        socket.on("eliminarProducto", async productId => {
            try {
                console.log("Recibida solicitud para eliminar el producto del servidor con ID:", productId);

                await Manager.deleteProduct(productId);

                socket.emit("productoEliminado", productId);
            } catch (error) {
                console.error("Error al eliminar el producto:", error.message);
                // Aquí puedes decidir cómo manejar el error, por ejemplo, enviar un mensaje de error al cliente
                socket.emit("errorEliminarProducto", error.message);
            }
        });


        //socket chat
        socket.on("nuevoMensaje", async data => {
            console.log(data)
            await Message.create(data);

            io.emit("nuevoMensaje", data);
        });


        // socket.on('agregarProductoAlCarrito', async ({ productId }) => {
        //     console.log('ID del producto recibido:', productId);
        //     try {
        //         // Crear un nuevo carrito
        //         const cart = await CartManager.createCart();

        //         // Obtener el ID del carrito creado
        //         const cid = cart._id;

        //         // Agregar el producto al carrito utilizando el ID del carrito y el ID del producto
        //         const updatedCart = await CartManager.addProductByID(cid, productId);
        //         console.log('Producto agregado al carrito:', updatedCart);
        //         // Emitir un evento de confirmación al cliente con el carrito actualizado
        //         socket.emit('productoAgregadoAlCarrito', updatedCart);
        //     } catch (error) {
        //         console.error('Error al agregar el producto al carrito:', error);
        //         // Enviar un mensaje de error al cliente si es necesario
        //     }
        // });

    
        
        
    });

}