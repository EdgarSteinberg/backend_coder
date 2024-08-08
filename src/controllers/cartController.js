import { CartServiceRepository } from "../repositories/index.js";
import { ProductServiceRespository } from "../repositories/index.js";
import { TicketServiceRepository } from "../repositories/index.js";
import { UserServiceRespository } from "../repositories/index.js";

import CustomError from "../services/errors/CustomError.js";
import { ErrorCodes } from "../services/errors/errorCodes.js";
import { generateCartIdErrorInfo } from "../services/errors/info.js";

import { devLogger as logger } from '../logger.js';

class CartController {

    async getAllCarts() {
        try {
            logger.debug('Fetching all carts');
            return await CartServiceRepository.getAll();

        } catch (error) {
            //console.error(error.message);
            logger.error(`Error al buscar los carritos ${error.message}`)
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al buscar los carritos',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }

    async getCartById(cid) {
        try {
            logger.debug(`Fetching all cart with ID: ${cid}`)
            const carts = await CartServiceRepository.getById(cid);

            if (!carts) {
                CustomError.createError({
                    name: 'InvalidParamError',
                    cause: `Product ID ${cid} not found`,
                    message: generateCartIdErrorInfo(cid),
                    code: ErrorCodes.INVALID_PARAM
                });
                return;
            }

            return carts;
        } catch (error) {
            //console.error(error.message);
            logger.error(`Error fetching cart with ID: ${cid}: ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al buscar el carrito',
                code: ErrorCodes.DATABASE_ERROR
            });
        }

    }

    async createCart() {
        try {
            const carts = await CartServiceRepository.create();

            //console.log('Carrito creado:', carts);
            logger.info(`Cart created successfully with ID: ${carts._id}`)
            return carts._id; // Devuelve solo el _id del carrito creado

        } catch (error) {
            //console.error(error.message);
            logger.error(`Error creating cart: ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al crear el carrito',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }


    async addProductByID(cid, pid) {
        try {
            // Busca el carrito por su ID y actualiza los productos
            const cart = await CartServiceRepository.createProductInCart(
                { _id: cid, "products.product": pid }, // Condición de búsqueda
                { $inc: { "products.$.quantity": 1 } }, // Incrementa la cantidad si el producto ya está en el carrito
                { new: true } // Devuelve el documento actualizado
            );

            // Si el producto no está en el carrito, agrégalo
            if (!cart) {
                const updatedCart = await CartServiceRepository.createProductInCart(
                    { _id: cid },
                    { $push: { products: { product: pid, quantity: 1 } } },
                    { new: true }
                );
                logger.info(`Producto con ID: ${pid} agregado al carrito con ID: ${cid}`);
                return updatedCart;
            }
            logger.info(`Producto con ID: ${pid} cantidad incrementada en el carrito con ID: ${cid}`);
            return cart;
        
        } catch (error) {
            // Maneja el error creando un error personalizado
            logger.error(`Error adding product with ID ${pid} to cart with ID ${cid}: ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al actualizar el carrito',
                code: ErrorCodes.DATABASE_ERROR
            });
            // Lanza el error para que pueda ser manejado por el controlador de errores global, si lo hay
            throw new Error('Error al actualizar el carrito: ' + error.message);
        }
    }

    
    //Eliminar producto del carrito por su ID
    async deleteProductInCart(cid, pid) {
        try {
            logger.debug(`Deleting product with ID: ${pid} from cart with ID: ${cid}`);
            const cart = await CartServiceRepository.deleteProduct(
                { _id: cid },
                { $pull: { products: { product: pid } } },
                { new: true }
            );

            if (!cart) {
                logger.warn(`Cart with ID: ${cid} not found`);
                CustomError.createError({
                    name: 'InvalidParamError',
                    cause: `Product ID ${cid} not found`,
                    message: generateCartIdErrorInfo(cid),
                    code: ErrorCodes.INVALID_PARAM
                });
                return null;
            }
            logger.info(`Product with ID: ${pid} deleted from cart with ID: ${cid}`);
            return cart;
       
        } catch (error) {
            logger.error(`Error deleting product with ID ${pid} from cart with ID ${cid}: ${error.message}`);
            // Maneja cualquier otro error creando un error personalizado
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al eliminar el producto del carrito',
                code: ErrorCodes.DATABASE_ERROR
            });
            // Lanza el error para que pueda ser manejado por el controlador de errores global, si lo hay
            throw new Error('Error al eliminar el producto del carrito: ' + error.message);
        }

    }

    //Agregar productos al carrito
    async updateCart(cid, products) {
        try {
            logger.debug(`Updating cart with ID: ${cid}`);
            const cart = await CartServiceRepository.updateInCart(
                { _id: cid },
                { $set: { products: products } },
                { new: true }
            );

            if (!cart) {
                logger.warning(`Cart with ID: ${cid} not found`);
                CustomError.createError({
                    name: 'InvalidParamError',
                    cause: `Product ID ${cid} not found`,
                    message: generateCartIdErrorInfo(cid),
                    code: ErrorCodes.INVALID_PARAM
                });
                return null;
            }
            logger.info(`Cart with ID: ${cid} updated successfully`);
            return cart;
        
        } catch (error) {
            logger.error(`Error updating cart with ID ${cid}: ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al actualizar el carrito',
                code: ErrorCodes.DATABASE_ERROR
            });
            throw new Error('Error al actualizar el carrito: ' + error.message);
        }
    }

    //Modifica la cantidad del producto en el carrito
    async updateProductQuantityInCart(cid, pid, quantity) {
        try {
            //logger.error(`Error updating cart with ID ${cid}: ${error.message}`);
            const cart = await CartServiceRepository.updateQuantity(
                { _id: cid, "products.product": pid },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            );

            if (!cart) {
                logger.warning(`Cart with ID: ${cid} not found`);
                CustomError.createError({
                    name: 'InvalidParamError',
                    cause: `Product ID ${cid} not found`,
                    message: generateCartIdErrorInfo(cid),
                    code: ErrorCodes.INVALID_PARAM
                });
                return null;
            }
            logger.info(`Quantity of product with ID: ${pid} updated to ${quantity} in cart with ID: ${cid}`);
            return cart;
       
        } catch (error) {
            logger.error(`Error updating quantity of product with ID ${pid} in cart with ID ${cid}: ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al actualizar el carrito',
                code: ErrorCodes.DATABASE_ERROR
            });
            throw new Error('Error al actualizar el carrito: ' + error.message);
        }
    }

    async removeAllProductsFromCart(cid) {
        try {
            logger.debug(`Removing all products from cart with ID: ${cid}`);
            const cart = await CartServiceRepository.removeProducts(
                cid,
                { $set: { products: [] } }, // Establece el arreglo de productos como vacío
                { new: true }
            );

            // Verifica si el carrito se actualizó correctamente
            if (!cart) {
                logger.warning(`Cart with ID: ${cid} not found`);
                // Si el carrito no se encontró, crea un error personalizado
                CustomError.createError({
                    name: 'NotFoundError',
                    cause: `Cart ID ${cid} not found`,
                    message: generateCartIdErrorInfo(cid),
                    code: ErrorCodes.NOT_FOUND
                });
                // Devuelve null para indicar que no se encontró el carrito
                return null;
            }
            logger.info(`All products removed from cart with ID: ${cid}`);
            // Devuelve el carrito actualizado
            return cart;
      
        } catch (error) {
            logger.error(`Error removing all products from cart with ID ${cid}: ${error.message}`);
            // Maneja cualquier otro error creando un error personalizado de base de datos
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al eliminar todos los productos del carrito',
                code: ErrorCodes.DATABASE_ERROR
            });
            // Lanza el error para que pueda ser manejado por el controlador de errores global, si lo hay
            throw new Error('Error al eliminar todos los productos del carrito: ' + error.message);
        }
    }



    async calculateTotalAmount(validProducts) {
        let totalAmount = 0;
        for (let item of validProducts) {
            totalAmount += item.product.price * item.quantity;
        }
        logger.debug(`Total amount calculated: ${totalAmount}`);
        return totalAmount;
    }

    async cartPurchase(cid, purchaser) {
        try {
            logger.debug(`Processing purchase for cart ID: ${cid} by user: ${purchaser}`);
            const cart = await CartServiceRepository.getById(cid)//.populate('products.product');
            //console.log(cart)

            const resultUserRepository = await UserServiceRespository.getById(purchaser)
            const purchaserEmail = resultUserRepository.email;
            //console.log(purchaserEmail);
            logger.info(`purchaserEmail ${resultUserRepository.email}`)

            if (!cart) {
                logger.warning(`Cart with ID: ${cid} not found`);
                throw new Error('Carrito no encontrado');
            }

            const validProducts = [];
            const failedProducts = [];

            for (let item of cart.products) {
                const product = item.product;
                if (product.stock >= item.quantity) {
                    console.log('este es el item', item.product._id)
                    validProducts.push(item);
                } else {
                    failedProducts.push(product._id);
                }
            }

            // Restar el stock de los productos válidos
            for (let item of validProducts) {
                await ProductServiceRespository.updateProductStock(
                    item.product._id,
                    item.quantity
                );
            };

            // // Remover productos con stock insuficiente del carrito
            // if (failedProducts.length > 0) {
            //     cart.products = cart.products.filter(item => !failedProducts.includes(item.product._id));
            //     await cart.save();
            // };

            //Filtar solo el id del producto 
            const validProductsIds = validProducts.map(product => product.product._id);

            // Crear el ticket
            const ticketData = {
                code: await this.generateUniqueCode(),
                purchase_datetime: Date.now(),
                amount: await this.calculateTotalAmount(validProducts),
                purchaser: purchaserEmail,
            };

            const ticket = await TicketServiceRepository.createTicket(ticketData);

            logger.info(`Purchase processed successfully for cart ID: ${cid}`);
            return { validProducts: validProductsIds, failedProducts, cart, ticket };
            //return { validProducts, failedProducts, cart };
       
        } catch (error) {
            logger.error(`Error processing purchase for cart ID ${cid}: ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al procesar la compra',
                code: ErrorCodes.DATABASE_ERROR
            })
            throw new Error('Error al procesar la compra: ' + error.message);
        }
    };
    // async cartPurchase(cid, purchaser) {
    //     try {
    //         logger.debug(`Processing purchase for cart ID: ${cid} by user: ${purchaser}`);
        
    //         // Obtén el carrito como una instancia de Mongoose (sin .lean())
    //         const cart = await CartServiceRepository.getById(cid);
        
    //         // Verifica si el carrito existe
    //         if (!cart) {
    //             logger.warning(`Cart with ID: ${cid} not found`);
    //             throw new Error('Carrito no encontrado');
    //         }
        
    //         // Obtén el email del comprador
    //         const resultUserRepository = await UserServiceRespository.getById(purchaser);
    //         const purchaserEmail = resultUserRepository.email;
    //         logger.info(`purchaserEmail ${purchaserEmail}`);
        
    //         const validProducts = [];
    //         const failedProducts = [];
        
    //         // Procesa los productos del carrito
    //         for (let item of cart.products) {
    //             const product = item.product;
    //             if (product.stock >= item.quantity) {
    //                 validProducts.push(item);
    //             } else {
    //                 failedProducts.push(product._id);
    //             }
    //         }
        
    //         // Actualiza el stock de los productos válidos y la cantidad en el carrito
    //         for (let item of validProducts) {
    //             await ProductServiceRespository.updateProductStock(
    //                 item.product._id,
    //                 -item.quantity // Restar la cantidad del stock
    //             );
        
    //             await CartServiceRepository.updateQuantity(
    //                 cid,
    //                 item.product._id,
    //                 item.quantity
    //             );
    //         }
        
    //         // Remover productos con stock insuficiente del carrito
    //         if (failedProducts.length > 0) {
    //             await CartServiceRepository.removeProducts(
    //                 cid,
    //                 { $pull: { products: { product: { $in: failedProducts } } } }
    //             );
    //         }
        
    //         // Crear el ticket
    //         const ticketData = {
    //             code: await this.generateUniqueCode(),
    //             purchase_datetime: new Date(), // Usar Date() en lugar de Date.now()
    //             amount: await this.calculateTotalAmount(validProducts),
    //             purchaser: purchaserEmail,
    //         };
        
    //         const ticket = await TicketServiceRepository.createTicket(ticketData);
        
    //         logger.info(`Purchase processed successfully for cart ID: ${cid}`);
    //         return { validProducts: validProducts.map(item => item.product._id), failedProducts, cart, ticket };
        
    //     } catch (error) {
    //         logger.error(`Error processing purchase for cart ID ${cid}: ${error.message}`);
    //         CustomError.createError({
    //             name: 'DatabaseError',
    //             cause: error.message,
    //             message: 'Error al procesar la compra',
    //             code: ErrorCodes.DATABASE_ERROR
    //         });
    //         throw new Error('Error al procesar la compra: ' + error.message);
    //     }
    // }
    
    
    async generateUniqueCode() {
        try {
            const randomCode = Math.floor(Math.random() * 1000) + 1;
            logger.debug(`Generated unique code: ${randomCode}`);
            return randomCode;
        } catch (error) {
            logger.error(`Error generating unique code: ${error.message}`);
            //console.log(error.message);
            throw new Error('Error al crear código aleatorio');
        }
    };
}

export { CartController };




