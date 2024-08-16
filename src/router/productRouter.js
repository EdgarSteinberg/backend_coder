import { Router } from 'express';
import passport from 'passport';

import { ProductController } from '../controllers/productController.js';
import { authorization } from '../middlewares/authorization.js';
import { uploader } from '../utils/multerUtil.js'
import addLogger from '../logger.js';

const Productrouter = Router();

const Manager = new ProductController();

Productrouter.get("/", addLogger, async (req, res, next) => {
    try {
        const products = await Manager.getAllProducts();
        const user = req.user

        res.send({ status: 'success', payload: { products: products, user: user } });
    } catch (error) {
        req.logger.error(`Error al buscar los productos ${error.message}`)
        next(error);
    }
});

Productrouter.get('/:pid', addLogger, async (req, res, next) => {
    try {
        const result = await Manager.getProductByID(req.params.pid);
        res.send({ status: 'success', payload: result });

    } catch (error) {
        req.logger.error(`Error al buscar el producto con ID:${req.params.pid} ${error.message}`)
        next(error); // Pasa el error al middleware de manejo de errores
    }
});

Productrouter.post('/', addLogger, passport.authenticate('jwt', { session: false }), authorization(["admin", "premium"]), uploader.array('thumbnail', 3), async (req, res, next) => {
    try {
        if (req.files && req.files.length > 0) {
            console.log('Archivos recibidos:', req.files); // Verifica que los archivos se reciban
            req.body.thumbnail = req.files.map(file => file.filename); // Almacena los nombres de los archivos en el array
            console.log('Thumbnail array:', req.body.thumbnail); // Verifica el array de thumbnail
        } else {
            req.body.thumbnail = []; // Asegúrate de que thumbnail esté siempre inicializado como un array
        }

        const userEmail = req.user.email;
        const userRole = req.user.role;

        if (userRole === 'premium') {
            req.body.owner = userEmail;
        } else {
            req.body.owner = 'admin';
        }

        const result = await Manager.createProduct(req.body);
        //res.send({ status: 'success', payload: result });
        res.redirect("/realTimeProducts")
    } catch (error) {
        req.logger.error(`Error al crear el producto ${error.message}`);
        next(error);
    }
});

Productrouter.put("/:pid", addLogger, uploader.array('thumbnails', 3), async (req, res, next) => {
    if (req.files) {
        req.body.thumbnail = [];
        req.files.forEach((file) => {
            req.body.thumbnail.push(file.filename);
        });
    }
    try {
        const pid = req.params.pid;
        const result = await Manager.updateProduct(pid, req.body);

        res.send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(`Error al modificar el producto con ID: ${req.params.pid} ${error.message}`)
        next(error); // Pasa el error al middleware de manejo de errores
    }
});

Productrouter.delete("/:pid", addLogger, passport.authenticate('jwt', { session: false }), authorization(["admin", "premium"]), async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const userEmail = req.user.email;
        const userRole = req.user.role;
        // Verificar permisos antes de eliminar el producto
        const product = await Manager.getProductByID(pid);
        console.log('producto ruta delete', product, 'userRole', userRole)
        if (userRole === 'admin' || (userRole === 'premium' && product.owner === userEmail)) {
            const result = await Manager.deleteProduct(pid);
            res.send({ status: 'success', payload: result });
        } else {
            req.logger.warning(`User ${userEmail} does not have permission to delete product with ID: ${pid}`);
            res.status(403).send({ status: 'error', message: 'No tienes permisos para eliminar este producto' });
        }
    } catch (error) {
        req.logger.error(`Error al eliminar el productos con ID:${req.params.pid}${error.message}`)
        next(error); // Pasa el error al middleware de manejo de errores
    }
});


export default Productrouter;

