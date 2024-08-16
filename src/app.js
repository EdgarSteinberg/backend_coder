import express from "express";
import handlebars from "express-handlebars";
import { Server } from 'socket.io';
import mongoose from "mongoose";
import passport from "passport";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'

import __dirname from "./utils/constantsUtil.js"
import websocket from './websocket.js'
import viewsRouter from './router/viewsRouter.js'
import productRouter from "./router/productRouter.js";
import cartRouter from "./router/cartRouter.js";
import messageRouter from "./router/messageRouter.js"
import userRouter from "./router/userRouter.js";
import ticketRouter from "./router/ticketRouter.js";
import initializatePassport from "./config/passportConfig.js";
import initializeGitHubPassport from "./config/passportConfigGitHub.js";
import fakerRouter from './router/fakerRouter.js'
import errorHandler from './middlewares/errors/index.js';
import addLogger from "./logger.js";
import loggerTestRouter from "./router/loggerRouter.js"
import gitHub from './router/gitHub.js'

dotenv.config();
//Express
const app = express();

//Coneccion a MongoDB
mongoose.connect(process.env.MONGODB_URI);

//Middlewares express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static('public'));
app.use(express.static(`${__dirname}/../../public`));

//Motores de plantillas Handlebars 
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/../views`);
app.use(cookieParser());

//Passport
initializatePassport();
initializeGitHubPassport();
app.use(passport.initialize());


//Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentacion sistema Adopme",
            description: "Esta documentacion cubre toda la API habilitada para Adopme"
        }
    },
    apis: [`${__dirname}/../docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


//Routers
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/chat", messageRouter);
app.use('/api/users', userRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/faker', fakerRouter);
app.use('/api/realTimeProducts', productRouter)
app.use('/api/gitHub', gitHub)

// Ruta para testear los logs
app.use('/api', loggerTestRouter);
//Errors 
app.use(errorHandler);
//Logger
app.use(addLogger);


//Vistas
app.use("/", viewsRouter);
app.use("/chat", messageRouter)
app.use("/products", productRouter);
app.use("/carts/:cid", cartRouter);
app.use('/mockingproducts', fakerRouter);
app.use('/reset-password', userRouter)
app.use('/realTimeProducts', productRouter)
app.use('/ticket/:tid', ticketRouter)
app.use('/admUsers', userRouter)

//Websocket||PORT8080
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
})

const io = new Server(httpServer);

websocket(io);

