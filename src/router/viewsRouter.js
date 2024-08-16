import { Router } from 'express';
import passport from 'passport';

import { ProductController } from '../controllers/productController.js';
import { CartController } from '../controllers/cartController.js';
import { MessagesController } from '../controllers/messageController.js';
import { userController } from '../controllers/userController.js';
import { TicketController } from '../controllers/ticketController.js';

import { authenticate, publicRoute } from '../middlewares/auth.js'
import { authorization } from '../middlewares/authorization.js';
import { getMockedProducts } from '../utils/fakerUtil.js';

const Manager = new ProductController();
const CartManager = new CartController();
const Messages = new MessagesController();
const Users = new userController();
const Ticket = new TicketController();

const router = Router();

//Ruta Home y Products
router.get('/', authenticate, (req, res) => {
    res.redirect('/products');
});


router.get("/products", authenticate, async (req, res) => {
    try {
        // Obtener los parámetros de la consulta
        const queryParams = {
            page: req.query.page,
            limit: req.query.limit,
            sort: req.query.sort,
            category: req.query.category,
            query: {} // Puedes añadir un objeto de consulta si es necesario
        };

        // Obtener todos los productos con los parámetros de la consulta
        const result = await Manager.getAllProducts(queryParams);
        const cart = await CartManager.getCartById(req.user.cart._id);
        // Renderizar la vista con los productos y los enlaces de paginación
        res.render(
            "home",
            {
                title: "Coder Ecommerce",
                products: result.payload,
                style: "index.css",
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink,
                user: req.user,
                cart: cart
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error al obtener los productos");
    }
});

router.get("/products/:pid", passport.authenticate('jwt', { session: false }), authenticate, authorization('user'), async (req, res) => {
    try {
        // Obtén el producto por ID
        const product = await Manager.getProductByID(req.params.pid);
        // Obtén el usuario autenticado
        const user = req.user;
        // Verifica que el usuario tenga un carrito asociado
        if (!user.cart) {
            throw new Error('User does not have a cart assigned');
        }
        // Extrae el ID del carrito
        const cartId = user.cart;

        // Obtén el carrito del usuario por su ID
        const cart = await CartManager.getCartById(cartId);
        console.log('carito ID:', cart)
        if (!cart) {
            throw new Error('Cart not found');
        }

        // Renderiza la vista con el producto, el carrito y el usuario
        res.render("product", {
            title: "Productos",
            product: product,
            style: "index.css",
            user: req.user,
            cart: cart
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


//Ruta Realtimeproduct
router.get("/realTimeProducts", passport.authenticate('jwt', { session: false }), authenticate, authorization(["admin", "premium"]), async (req, res) => {
    const queryParams = {
        page: req.query.page,
        limit: req.query.limit || 100,
        sort: req.query.sort,
        category: req.query.category,
        query: req.query.query,
        user: req.user,
        //premium: req.user.premium 
    };

    try {
        let allProduct = await Manager.getAllProducts(queryParams);
        //console.log('User info in realTimeProducts route:', req.user); // Agrega este console.log para verificar el req.user
        res.render(
            "realTimeProducts",
            {
                title: "Coder Ecommerce",
                products: allProduct.payload, // Accede al array de productos en el payload
                style: "index.css",
                user: req.user,
                premium: req.user.role === 'premium',
                admin: req.user.role === 'admin'
            });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).send("Error al obtener los productos en tiempo real");
    }
});

//Ruta Chat
router.get("/chat", authenticate, authorization("user"), async (req, res) => {
    const allMessage = await Messages.getAllMessages();

    res.render(
        "chat",
        {
            title: "Coder Chat",
            chats: allMessage,
            style: "index.css"
        });
});

//Ruta Cart
router.get("/carts/:cid", authenticate, async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.params.cid);
        //console.log(cart);
        // Recorre los productos en el carrito
        const products = cart.products.map(item => ({
            productId: item.product,
            quantity: item.quantity
        }));

        //console.log(products);
        res.render(
            "carts",
            {
                title: "Carrito Compras",
                cart: cart,
                products: products,
                style: "index.css"

            });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get('/login', publicRoute, (req, res) => {
    const failLogin = req.query.failLogin === 'true'; // Leer el parámetro de la URL
    res.render('login', {
        title: "Coder Login",
        style: 'index.css',
        failLogin // Pasar la variable a la vista
    });
});
router.get("/register", publicRoute, (req, res) => {
    const failRegister = req.query.failRegister === 'true'; 
    res.render(
        'register',
        {
            title: 'Coder Register',
            style: 'index.css',
            failRegister
        });
});

router.get('/profile', authenticate, (req, res) => {
    res.render(
        'profile',
        {
            title: 'Coder Perfil',
            style: 'index.css',
            user: req.user
        });
});

router.get('/notFound', authenticate, (req, res) => {
    res.render(
        'notFound',
        {
            title: 'Coder Not Found',
            style: 'index.css',
            user: req.user
        });
});

router.get("/mockingproducts", authenticate, authorization("admin"), async (req, res) => {
    const products = getMockedProducts()
    res.render(
        'faker',
        {
            title: 'Coder Faker',
            style: 'index.css',
            products
        });
});

router.get("/reset-password", async (req, res) => {
    const { token } = req.query
    console.log('Token recibido:', token);
    if (!token) {
        return res.status(400).send({ status: 'error', message: 'Token no proporcionado' });
    }
    res.render(
        'reset-password',
        {
            title: 'Recuperación de Contraseña',
            style: 'index.css',
            token
        }
    )
});


router.get("/recover-password", async (req, res) => {
    res.render(
        'recover-password',
        {
            title: 'Recuperación de Contraseña',
            style: 'index.css'
        }
    )
});

router.get("/check-email", async (req, res) => {
    res.render(
        'checkEmail',
        {
            title: 'Correo Enviado',
            style: 'index.css'
        }
    )
});

router.get("/uploadDocuments", authenticate, async (req, res) => {
    res.render(
        'uploadDocuments',
        {
            title: 'SendDocuments',
            style: 'index.css',
            user: req.user
        }
    )
});

router.get("/admUsers", authenticate, authorization("admin"), async (req, res) => {
    const users = await Users.getAllUsersNew();
    res.render(
        'admUsers',
        {
            title: 'AdministrarUsuarios',
            style: 'index.css',
            users: users,
            user: req.user
        }
    )
});

router.get('/purcharser', authenticate, async (req, res) => {
    const user = req.user;
    const cartId = user.cart;
    const cart = await CartManager.getCartById(cartId);
    //console.log('carrito', cart)

    const products = cart.products.map(item => ({
        productId: item.product, // Asegúrate de que esto contenga toda la información del producto
        quantity: item.quantity
    }));

    // Variables para almacenar cantidades y precios
    let totalPrice = 0;
    const productTotals = []; // Para almacenar el total de cada producto

    // Accede a la información del producto y al precio
    for (const item of products) {
        const product = item.productId; // Esto debe ser el objeto completo del producto
        if (product) {
            const productTotal = item.quantity * product.price; // Precio total por producto
            productTotals.push({
                productId: product._id,
                title: product.title,
                description: product.description,
                quantity: item.quantity,
                price: product.price,
                total: productTotal
            });

            totalPrice += productTotal; // Acumula el precio total
            console.log('Product:', product);
            console.log('Price:', product.price);
            console.log('Total for this product:', productTotal);
        }
    }

    console.log('Product Totals:', productTotals);
    console.log('Total Price:', totalPrice);

    res.render(
        'purcharser',
        {
            title: 'Order',
            style: 'index.css',
            products: productTotals,
            users: user,
            cart: cart,
            totalPrice: totalPrice
        }
    )
})

router.get('/ticket/:tid', authenticate, async (req, res) => {
    const { tid } = req.params;
    const ticket = await Ticket.getTicketById(tid);

    res.render(
        'ticket',
        {
            title: 'ticket',
            style: 'index.css',
            ticket: ticket
        }
    )
})

export default router;