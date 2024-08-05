import { ProductServiceRespository } from '../repositories/index.js';
import CustomError from '../services/errors/CustomError.js';
import { ErrorCodes } from '../services/errors/errorCodes.js';
import { generateProductIdErrorInfo, generateProductErrorInfo } from '../services/errors/info.js';
import { devLogger as logger } from '../logger.js';
import { userController } from './userController.js';
import nodemailer from 'nodemailer';

const Users = new userController();

class ProductController {

    async getAllProducts(queryParams = {}) {
        try {
            // Obtener los parámetros de la consulta
            logger.debug('Fetching all products with query params:', queryParams);
            const { page = 1, limit = 10, sort = null, category = null } = queryParams;

            // Construir la consulta a la base de datos
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                lean: true
            };

            const searchQuery = category ? { category: category.toLowerCase() } : {};

            if (sort) {
                if (sort === 'asc') {
                    options.sort = { price: 1 };
                } else if (sort === 'desc') {
                    options.sort = { price: -1 };
                }
            }

            // Obtener los resultados paginados
            const result = await ProductServiceRespository.getAll(searchQuery, options);

            // Construir los enlaces de paginación
            const baseURL = "http://localhost:8080/products";
            const prevLink = result.hasPrevPage ? `${baseURL}?page=${result.prevPage}` : null;
            const nextLink = result.hasNextPage ? `${baseURL}?page=${result.nextPage}` : null;

            // Devolver los resultados en el formato correcto
            return {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            };
        } catch (error) {
            //console.error(error.message);
            logger.error(`Error fetching products: ${error.message}`)
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al buscar los productos',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }

    async getProductByID(pid) {
        try {
            const product = await ProductServiceRespository.getById({ _id: pid });
            if (!product) {
                CustomError.createError({
                    name: 'InvalidParamError',
                    cause: `Product ID ${pid} not found`,
                    message: generateProductIdErrorInfo(pid),
                    code: ErrorCodes.INVALID_PARAM
                });
                return;
            }
            return product;
        } catch (error) {
            //console.error(error.message);
            logger.error(`Error fetching product with ID: ${pid}: ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al buscar el producto',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }


    async createProduct(producto) {
        const { title, description, code, price, stock, category, thumbnail, owner } = producto;

        if (!title || !description || !code || !price || !stock || !category) {
            logger.warning('Faltan campos obligatorios al crear el producto')
            CustomError.createError({
                name: 'InvalidTypesError',
                cause: generateProductErrorInfo(producto),
                message: 'Error al crear el producto: Uno o más campos requeridos están vacíos',
                code: ErrorCodes.INVALID_TYPES_ERROR
            });
        }

        try {
            //console.log("info del controlador", owner)
            let productOwner = owner;


            logger.debug('Creating product with data:', producto);
            const result = await ProductServiceRespository.create({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnail: thumbnail ?? [],
                owner: productOwner
            });

            return result;
        } catch (error) {
            logger.error(`Error creating product: ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al crear el producto',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }


    async updateProduct(id, producto) {
        try {
            const result = await ProductServiceRespository.productUpdate({ _id: id }, producto);
            return result;

        } catch (error) {
            //console.error(error.message);
            logger.error(`Error al actualizar el producto con ID: ${id} ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al actualizar el producto',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }

    // async deleteProduct(productId) {
    //     try {

    //         const result = await ProductServiceRespository.productDelete({ _id: productId });
    //         if (result.deletedCount === 0) {
    //             logger.warning(`Product with ID: ${productId} not found`);
    //             CustomError.createError({
    //                 name: 'InvalidParamError',
    //                 cause: `Product ID ${productId} not found`,
    //                 message: `El producto ${productId} no existe`,
    //                 code: ErrorCodes.INVALID_PARAM
    //             });


    //             logger.info(`Product with ID: ${productId} deleted successfully con email ${userEmail}`);
    //             return result;
    //         }
    //     } catch (error) {
    //         //console.error(error.message);
    //         logger.error(`Error deleting product with ID: ${productId}: ${error.message}`);
    //         CustomError.createError({
    //             name: 'DatabaseError',
    //             cause: error.message,
    //             message: 'Error al eliminar el producto',
    //             code: ErrorCodes.DATABASE_ERROR
    //         });
    //     }
    // }

    async deleteProduct(productId) {
        try {
            // Obtener el producto para verificar el propietario
            const product = await ProductServiceRespository.getById(productId);
            if (!product) {
                logger.warning(`Product with ID: ${productId} not found`);
                CustomError.createError({
                    name: 'InvalidParamError',
                    cause: `Product ID ${productId} not found`,
                    message: `El producto ${productId} no existe`,
                    code: ErrorCodes.INVALID_PARAM
                });
                return;
            }

            const result = await ProductServiceRespository.productDelete({ _id: productId });
            if (result.deletedCount === 0) {
                logger.warning(`Product with ID: ${productId} not deleted`);
                CustomError.createError({
                    name: 'DatabaseError',
                    cause: `Failed to delete product with ID: ${productId}`,
                    message: 'Error al eliminar el producto',
                    code: ErrorCodes.DATABASE_ERROR
                });
                return;
            }

            // Obtener el email del propietario del producto
            const ownerEmail = product.owner;
            // Obtener los datos del usuario por email
            const user = await Users.getEmail(ownerEmail);

            // Enviar un correo si el rol del propietario es 'premium'
            if (user && user.role === 'premium') {
                await this.sendProductDeletionEmail(ownerEmail, productId);
            }

            logger.info(`Product with ID: ${productId} deleted successfully`);
            return result;
        } catch (error) {
            logger.error(`Error deleting product with ID: ${productId}: ${error.message}`);
            CustomError.createError({
                name: 'DatabaseError',
                cause: error.message,
                message: 'Error al eliminar el producto',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }

    // Función para enviar el correo de eliminación del producto
    async sendProductDeletionEmail(email, productId) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transport.sendMail({
            from: 'Edgar Steinberg <s.steinberg2019@gmail.com>',
            to: email,
            subject: 'Eliminación de Producto',
            html: `<div style="font-family: Arial, sans-serif; color: #333;">
                    <h1>Notificación de Eliminación de Producto</h1>
                    <p>El producto con ID ${productId} ha sido eliminado de la plataforma.</p>
                    <p>Si tienes alguna pregunta, por favor contáctanos.</p>
                    <p>Gracias,</p>
                    <p>El equipo de soporte de AppCoder</p>
                    </div>`,
        });
    }

}

export { ProductController };

