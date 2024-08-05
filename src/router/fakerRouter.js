import { Router } from 'express';
import { getMockedProducts } from '../utils/fakerUtil.js';
import addLogger from '../logger.js';
const router = Router();

router.get('/mockingproducts', addLogger, async (req, res) => {
    try {
        const products = getMockedProducts();
        res.send({
            status: 'success',
            payload: products
        });
    } catch (error) {
        req.logger.error(`Error al obtener productos falsos: ${error.message}`);
    }
});

export default router;
