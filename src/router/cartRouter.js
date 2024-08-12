import { Router } from 'express';
import passport from 'passport';

import { CartController } from '../controllers/cartController.js';
import { ProductController } from '../controllers/productController.js';
import addLogger from '../logger.js';

const Manager = new ProductController;
const carts = new CartController();

const CartRouter = Router();

CartRouter.get('/', addLogger, async (req, res, next) => {
    try {
        const result = await carts.getAllCarts();
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        req.logger.error(`Error al buscar el carrito ${error.message}`)
        next(error)
    }
});

CartRouter.get('/:cid', addLogger, async (req, res, next) => {
    try {
        const result = await carts.getCartById(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.error(`Error al buscar el carrito con ID: ${req.params.cid} ${error.message}`)
        next(error)
    }
});

CartRouter.post("/", addLogger, async (req, res, next) => {
    try {
        if (process.env.NODE_ENV === 'test') {
            const { userId } = req.body
            const result = await carts.createCart(userId);
            res.send({ status: 'success', payload: { _id: result._id, ...result } });
        } else {
            const result = await carts.createCart();
            res.send({ status: 'success', payload: result })
        }

    } catch (error) {
        req.logger.error(`Error al crear el carrito  ${error.message}`)
        next(error)
    }
});

CartRouter.post("/:cid/products/:pid", addLogger, passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { cid, pid } = req.params;
    const userEmail = req.user.email;
    const userRole = req.user.role;

    req.logger.debug(`Request to add product with ID: ${pid} to cart with ID: ${cid} by user: ${userEmail} with role: ${userRole}`);

    try {
    
        const product = await Manager.getProductByID(pid);

        if (userRole === 'premium' && product.owner === userEmail) {
            req.logger.warning(`User ${userEmail} cannot add their own product to the cart.`);
            return res.status(403).send({ status: 'error', message: 'No puedes agregar tu propio producto al carrito' });
        }

        // Agregar producto al carrito
        const result = await carts.addProductByID(cid, pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(`Error al añadir producto al carrito con ID: ${pid} ${error.message}`);
        next(error);
    }
});

CartRouter.delete("/:cid/products/:pid", addLogger, async (req, res, next) => {
    try {
        const result = await carts.deleteProductInCart(req.params.cid, req.params.pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(`Error al eliminar producto del carrito con ID: ${req.params.cid} ${error.message}`)
        next(error)
    }

})

CartRouter.put("/:cid", addLogger, async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const result = await carts.updateCart(cid, req.body);
        res.send({status: 'success', payload: result });

    } catch (error) {
        req.logger.error(`Error al actualizar el carrito con ID: ${req.params.cid} ${error.message}`)
        next(error)
    }
});

CartRouter.put("/:cid/products/:pid", addLogger, async (req, res, next) => {
    try {
        const result = await carts.updateProductQuantityInCart(req.params.cid, req.params.pid, req.body.quantity);
        res.send({ status: 'success',payload: result});
    } catch (error) {
        req.logger.error(`Error al actualizar la cantidad del producto en el carrito con ID: ${req.params.cid} ${error.message}`)
        next(error)
    }

});

CartRouter.delete("/:cid", addLogger, async (req, res, next) => {
    try {
        const result = await carts.removeAllProductsFromCart(req.params.cid);
        res.send({status: 'success',payload: result});
    } catch (error) {
        req.logger.error(`Error al eliminar todos los productos del carrito con ID: ${req.params.cid} ${error.message}`)
        next(error)
    }

});

CartRouter.post('/:cid/purchase', addLogger, async (req, res, next) => {
    try {
        const { cid } = req.params;
        const { purchaser } = req.body;

        // Crear el ticket
        const result = await carts.cartPurchase(cid, purchaser);

        // Vaciar el carrito
        await carts.removeAllProductsFromCart(cid);

        let message;
        if (result.failedProducts.length === 0) {
            message = "¡Su compra ha sido exitosa!";
        } else {
            message = "Algunos productos no tienen suficiente stock y no se pudieron comprar.";
        }
        
        res.redirect(`/ticket/${result.ticket._id}`);
    } catch (error) {
        req.logger.error(`Error al procesar la compra para el carrito con ID: ${req.params.cid}: ${error.message}`);
        next(error);
    }
});



export default CartRouter