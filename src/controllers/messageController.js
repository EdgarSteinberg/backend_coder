import { MessageServiceRepositori } from "../repositories/index.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorCodes } from "../services/errors/errorCodes.js";
import { generateMessageError } from "../services/errors/info.js";
import { devLogger as logger } from '../logger.js';

class MessagesController {

    async getAllMessages() {
        return await MessageServiceRepositori.getAllMessages();
    }

    async create(userData) {
        const { user, message } = userData

        if (!user || !message) {
            CustomError.createError({
                name: 'MessageCreationError',
                cause: generateMessageError(userData),
                message: 'User or message not provided',
                code: ErrorCodes.INVALID_TYPES_ERROR
            });
        }

        try {
            const result = await MessageServiceRepositori.createMessage({
                user,
                message
            });

            return result;
        } catch (error) {
            //console.error(error.message)
            logger.error(`Error al crear el mensaje ${error.message}`)
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al crear el message',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }


}

export { MessagesController };