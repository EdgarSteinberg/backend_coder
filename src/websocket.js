import { ProductController } from "./controllers/productController.js";
import { MessagesController } from "./controllers/messageController.js";

const Manager = new ProductController();
const Message = new MessagesController();

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

        
    });

}