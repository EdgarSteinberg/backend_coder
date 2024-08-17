import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import dayjs from 'dayjs';

import { UserServiceRespository } from '../repositories/index.js';
import { isValidPassword, createHash } from "../utils/cryptoUtil.js";
import CustomError from '../services/errors/CustomError.js';
import { ErrorCodes } from '../services/errors/errorCodes.js';
import { generateUserErrorInfo, generateUserIdErrorInfo, generateLoginErrorInfo } from '../services/errors/info.js';
import { devLogger as logger } from '../logger.js';
import { CartController } from './cartController.js';

dotenv.config();
const CartManager = new CartController();
const SECRET_KEY = process.env.SECRET_KEY;

class userController {

    async getAllUsers() {
        return await UserServiceRespository.getAllNew();
    }

    async getAllUsersNew() {
        return await UserServiceRespository.getAll();
    }

    async getUser(uid) {
        try {
            const user = await UserServiceRespository.getById(uid);
            if (!user) {
                CustomError.createError({
                    name: 'UserNotFoundError',
                    cause: `User ID ${uid} not found`,
                    message: generateUserIdErrorInfo(uid),
                    code: ErrorCodes.INVALID_PARAM
                });
            }
            return user;
        } catch (error) {
            //console.error(error.message);
            logger.error(error.message);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error retrieving user',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }


    async register(user) {
        const { first_name, last_name, email, age, password, username, role } = user;

        if (!first_name || !last_name || !email || !age || !password) {
            CustomError.createError({
                name: 'InvalidUserInputError',
                cause: generateUserErrorInfo(user),
                message: 'Error registering user: one or more fields are invalid',
                code: ErrorCodes.INVALID_TYPES_ERROR
            });
        }
        // Crear un carrito para el nuevo usuario
        const cart = await CartManager.createCart();
        const cartId = cart._id
        // Imprime el cartId para verificar su valor
        //console.log('Cart ID:', cartId);
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            // Crear el nuevo usuario
            const newUser = await UserServiceRespository.createRegister({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
                username,
                role,
        
            });

            // Asignar el carrito al usuario
            newUser.cart = cartId;

            await newUser.save();

            return newUser;
        } catch (error) {
            logger.error(error.message);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error registering user',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }


    async updateLastConnection(email) {
        try {
            console.log(`Updating last connection for email: ${email}`);
            const result = await UserServiceRespository.updateLastConnection(email);
            console.log('Last connection update result:', result);
        } catch (error) {
            logger.error(`Error updating last connection: ${error.message}`);
            throw new Error('Error updating last connection');
        }
    }

    async login(email, password) {
        if (!email || !password) {
            throw CustomError.createError({
                name: 'InvalidUserInputError',
                cause: generateLoginErrorInfo(email, 'Email or password not provided'),
                message: `Email or password not provided`,
                code: ErrorCodes.INVALID_TYPES_ERROR
            });
        }

        try {
            const user = await UserServiceRespository.createLogin(email, password);

            if (!user) {
                throw CustomError.createError({
                    name: 'UserNotFoundError',
                    cause: generateLoginErrorInfo(email, 'User with email not found'),
                    message: `User with email ${email} not found`,
                    code: ErrorCodes.INVALID_PARAM
                });
            }

            if (isValidPassword(user, password)) {
                delete user.password;
                // Registro para verificar el email
                console.log(`User ${email} is logging in.`);

                // Actualizar última conexión
                //const result = await UserServiceRespository.updateLastConnection(email);
                const result = await this.updateLastConnection(email);
                // Registro para verificar el resultado
                console.log(`Last connection update result:`, result);

                return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
            }

            throw CustomError.createError({
                name: 'InvalidPasswordError',
                cause: generateLoginErrorInfo(email, 'Password is incorrect'),
                message: `Password for user ${email} is incorrect`,
                code: ErrorCodes.INVALID_PARAM
            });
        } catch (error) {
            //console.error(error.message);
            logger.error(error.message);
            throw CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error logging in user',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }

    async updateUser(uid, updateData) {
        try {
            return await UserServiceRespository.updateUser(uid, updateData);
        } catch (error) {
            //console.error(error.message);
            logger.error(error.message);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error updating user',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }

    async getEmail(email) {
        try {
            return await UserServiceRespository.getEmail(email);
        } catch (error) {
            logger.error(error.message)
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error fetching user by email',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }
    // NODEMAILER 
    async requestPasswordReset(email) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const user = await UserServiceRespository.getEmail(email);
        if (!user) {
            throw new Error('Correo electrónico no encontrado');
        }

        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
        console.log(`Este el token desde el email`, token)

        // Enviar correo con el enlace de restablecimiento de contraseña
        await transport.sendMail({
            from: 'Edgar Steinberg <s.steinberg2019@gmail.com>',
            to: email,
            subject: 'Recuperación de Contraseña',
            html: `<div style="font-family: Arial, sans-serif; color: #333;">
                     <h1>Solicitud de Recuperación de Contraseña</h1>
                     <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, por favor ignora este correo.</p>
                     <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                     <a href="https://backend-coder-va89.onrender.com/reset-password?token=${token}">
                     <button class="btnChat">Restablecer Contraseña</button>
                     </a>
                     <p>Este enlace es válido por 1 hora.</p>
                     <p>Gracias,</p>
                     <p>El equipo de soporte de AppCoder</p>
                   </div>`,
        });

        return token;
    }

    async resetPassword(token, newPassword) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            const { email } = decoded;
            const user = await UserServiceRespository.getEmail(email);

            if (!user) {
                throw new Error('Correo electrónico no encontrado');
            }

            if (isValidPassword(user, newPassword)) {
                throw new Error('La nueva contraseña no puede ser la misma que la anterior');
            }

            const hashedPassword = await createHash(newPassword); // Aquí se utiliza correctamente
            await UserServiceRespository.updateUser(user._id, { password: hashedPassword });
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('El enlace ha expirado. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.');
            } else {
                throw error;
            }
        }
    }

    // async uploadDocuments(uid, documents) {
    //     try {
    //         const result = await UserServiceRespository.uploadDocuments(uid, documents);
    //         return result;
    //     } catch (error) {
    //         console.error('Error uploading documents:', error);
    //         throw new Error('Error uploading documents');
    //     }
    // }
    
    async uploadDocuments(uid, documents) {
        try {
            const result = await UserServiceRespository.uploadDocuments(uid, documents);
            return result;
        } catch (error) {
            logger.error(`Error uploading documents for user with ID: ${uid}: ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al subir los documentos',
                code: ErrorCodes.DATABASE_ERROR
            });
            throw new Error('Error uploading documents');
        }
    }
    

    async deleteInactiveUsers() {
        const TWO_DAYS_AGO = dayjs().subtract(2, 'day').toDate(); // Cambiado a 2 días
        //const THIRTY_MINUTES_AGO = dayjs().subtract(30, 'minute').toDate();
        console.log('Tiempo de referencia (2 dias):', TWO_DAYS_AGO);


        try {
            // Obtener todos los usuarios
            const users = await UserServiceRespository.getAll();

            // Filtrar usuarios inactivos
            const inactiveUsers = users.filter(user => {
                const lastConnection = new Date(user.last_connection);
                console.log('Última conexión del usuario:', lastConnection);
                return lastConnection < TWO_DAYS_AGO;
            });

            if (inactiveUsers.length === 0) {
                console.log('No hay usuarios inactivos para eliminar');
                return { status: 'success', message: 'No hay usuarios inactivos' };
            }

            // Configurar el transporte para el envío de correos electrónicos
            const transport = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Enviar correos electrónicos informando la eliminación
            for (const user of inactiveUsers) {
                await transport.sendMail({
                    from: 'Edgar Steinberg <s.steinberg2019@gmail.com>',
                    to: user.email,
                    subject: 'Eliminación de Cuenta por Inactividad',
                    html: `<div style="font-family: Arial, sans-serif; color: #333;">
                            <h1>Cuenta Eliminada</h1>
                            <p>Hola ${user.first_name},</p>
                            <p>Te informamos que tu cuenta ha sido eliminada debido a inactividad durante más de 2 días.</p>
                            <p>Si crees que esto es un error, por favor, contáctanos.</p>
                            <p>Gracias,</p>
                            <p>El equipo de soporte de AppCoder</p>
                           </div>`,
                });
            }

            // Eliminar usuarios después de enviar los correos electrónicos
            for (const user of inactiveUsers) {
                await UserServiceRespository.deleteUserById(user._id);
            }

            return { status: 'success', message: `Eliminados ${inactiveUsers.length} usuarios inactivos` };
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error);
            throw new Error('Error al eliminar usuarios inactivos');
        }
    }

    async deleteUser(id) {
        try {
            const result = await UserServiceRespository.deleteUserById(id);
            return result; // Devuelve el resultado de la eliminación
        } catch (error) {
            console.error(`Error al eliminar el usuario con ID ${id}:`, error.message);
            throw new Error(`Error al eliminar el usuario con ID ${id}`);
        }
    }

};

export { userController };

