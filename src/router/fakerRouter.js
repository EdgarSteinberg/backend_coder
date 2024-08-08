import { Router } from 'express';
import { getMockedProducts } from '../utils/fakerUtil.js';
import addLogger from '../logger.js';
const router = Router();

router.get('/mockingproducts', addLogger, async (req, res) => {
    try {
        const products = getMockedProducts();
        res.send({ status: 'success',payload: products});
    } catch (error) {
        req.logger.error(`Error al obtener productos falsos: ${error.message}`);
    }
});
router.get('/mockingproducts/:mid', addLogger, async (req, res) => {
    const { mid } = req.params;
    try {
        const products = getMockedProducts();
        const product = products.find(p => p._id === mid);
        if (product) {
            res.send({ status: 'success', payload: product });
        } else {
            res.status(404).send({ status: 'error', message: 'Producto no encontrado' });
        }
    } catch (error) {
        req.logger.error(`Error al obtener producto falso: ${error.message}`);
        res.status(500).send({ status: 'error', message: 'Error al obtener producto' });
    }
});

export default router;



