import { Router } from 'express';
import passport from 'passport';

import { ProductController } from '../controllers/productController.js';
import { CartController } from '../controllers/cartController.js';
import { MessagesController } from '../controllers/messageController.js';
import { userController } from '../controllers/userController.js';

import { authenticate, publicRoute } from '../middlewares/auth.js'
import { authorization } from '../middlewares/authorization.js';
import { getMockedProducts } from '../utils/fakerUtil.js';

const Manager = new ProductController();
const CartManager = new CartController();
const Messages = new MessagesController();
const Users = new userController();

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

// router.get("/products/:pid", passport.authenticate('jwt', { session: false }), authenticate, authorization('user'), async (req, res) => {
//     const result = await Manager.getProductByID(req.params.pid)
//       // Obtén el carrito del usuario por su ID
//         const cart = await CartManager.getCartById(req.user._id);
//      // Agrega el console.log para verificar req.user
//      console.log('Usuario autenticado en product:ID:', req.user, "carrito del usuario", cart);
//     res.render("product",
//         {
//             title: " Productos",
//             product: result,
//             style: "index.css",
//             user: req.user
//         });
// });
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
        console.log('User info in realTimeProducts route:', req.user); // Agrega este console.log para verificar el req.user
        res.render(
            "realTimeProducts",
            {
                title: "Coder Ecommerce",
                products: allProduct.payload, // Accede al array de productos en el payload
                style: "index.css",
                user: req.user,
                premium: req.user.role === 'premium',
                admin: req.user.role === 'admin'
                //premium: req.user.role === "premium" : "admin" // Pasa el rol del usuario específicamente
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

        // Puedes usar los productos como quieras aquí, por ejemplo, pasándolos a la vista
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


// router.get("/carts/:cid", authenticate, async (req, res) => {
//     try {
//         const cart = await CartManager.getCartById(req.params.cid);
//         console.log(cart);

//         // Recorre los productos en el carrito
//         const productIds = cart.products.map(item => item.product);
//         console.log('Product IDs:', productIds);

//         // Obtén detalles de los productos usando los IDs
//         const products = await Promise.all(productIds.map(async productId => {
//             const product = await Manager.getProductByID(productId);
//             return {
//                 productId: product._id,
//                 title: product.title,
//                 description: product.description,
//                 price: product.price,
//                 quantity: cart.products.find(p => p.product.toString() === productId.toString()).quantity
//             };
//         }));

//         // Puedes usar los productos como quieras aquí, por ejemplo, pasándolos a la vista
//         console.log(products);
//         res.render("carts", {
//             title: "Carrito Compras",
//             cart: cart,
//             products: products,
//             style: "index.css"
//         });
//     } catch (error) {
//         console.error("Error al obtener el carrito", error);
//         res.status(500).json({ error: "Error interno del servidor" });
//     }
// });

//Ruta Login Register Logout
router.get("/login", publicRoute, (req, res) => {
    res.render(
        'login',
        {
            title: "Coder Login",
            style: 'index.css',
            //failLogin: req.session.failLogin ?? false 

        });
});

router.get("/register", publicRoute, (req, res) => {
    res.render(
        'register',
        {
            title: 'Coder Register',
            style: 'index.css',
            //failRegister: req.session.failRegister ?? false
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
    for (const product of products) {
        //console.log(product.id); // Accede al id de cada producto
    }
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
    res.render(
        'faker',
        {
            title: 'Coder Faker',
            style: 'index.css',
            products, // Pasamos los productos al contexto de la vista
            user: req.user,
            cart: cart
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
            users: users
        }
    )
});


export default router;