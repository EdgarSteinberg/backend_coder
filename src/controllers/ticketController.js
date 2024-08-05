import { TicketServiceRepository } from "../repositories/index.js";
import { CartServiceRepository } from "../repositories/index.js";
import { UserServiceRespository } from "../repositories/index.js";
import { devLogger as logger } from '../logger.js';

class TicketController {
   
    async getAllTickets() {
        return await TicketServiceRepository.getAll();
    }

    async getTicketById(tid) {
        return await TicketServiceRepository.getTicketById(tid);
    }

    async createTicket(ticket) {
        const { purchaser, cart } = ticket

        if (!cart || !purchaser) {
            throw new Error('Error al crear el ticket');
        }

        const resultUserRepository = await UserServiceRespository.getById(purchaser)
        const purchaserEmail = resultUserRepository.email;
        //console.log(purchaserEmail);
        logger.info(`Email del comprador: ${purchaserEmail}`);

        const resultCartRespository = await CartServiceRepository.getById(cart)
        const cartProducts = resultCartRespository.products
        //console.log("Productos del carrito:", cartProducts);
        logger.info("Productos del carrito:", cartProducts);

        const amount = cartProducts.reduce((acc, cartItem) => acc + (cartItem.product.price * cartItem.quantity), 0);
        try {
            const code = await this.generateUniqueCode();
            const purchase_datetime = Date.now();

            const newTicket = {
                code,
                purchase_datetime,
                amount,
                purchaser: purchaserEmail
            };

            const result = await TicketServiceRepository.createTicket(newTicket);
            //await CartServiceRepository.updateCartWithTicket(cart, result._id);
            logger.info(`Ticket creado exitosamente: ${JSON.stringify(result)}`);
            return result
        } catch (error) {
            //console.error(error.message);
            logger.error(`Error al crear el ticket: ${error.message}`);
            throw new Error("Error al crear ticket")
        }
    }

    async generateUniqueCode() {
        try {
            const randomCode = Math.floor(Math.random() * 1000) + 1;
            return randomCode
        } catch (error) {
            //console.log(error.message);
            logger.error(`Error al generar código único: ${error.message}`);
            throw new Error('Error al crear code random')
        }
    }


}

export { TicketController }