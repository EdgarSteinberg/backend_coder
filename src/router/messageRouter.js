import { Router } from 'express';
import passport from 'passport';

import { MessagesController } from '../controllers/messageController.js';
import { authorization } from '../middlewares/authorization.js';
import addLogger from '../logger.js';

const MessageRouter = Router();

const Messages = new MessagesController();

MessageRouter.get("/", addLogger, async (req, res, next) => {
    try {
        const result = await Messages.getAllMessages();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.error(`Error al obtener mensajes: ${error.message}`)
        next(next)
    }
});

MessageRouter.post("/", addLogger, passport.authenticate('jwt', { session: false }), authorization("user"), async (req, res, next) => {
    try {
        const result = await Messages.create(req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.error(`Error al crear mensaje: ${error.message}`);
        next(error)
    }
});

export default MessageRouter;