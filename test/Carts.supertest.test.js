import { expect } from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const requester = supertest('http://localhost:8080');
const testProduct = { title: 'JackDaniels', description: 'Whisky', code: 'JD', price: 100, stock: 100, category: 'Bebidas' };

const user = {
    email: 'testuser@example.com',
    role: 'admin'
};

// Genera un token JWT usando la clave secreta del .env
const token = jwt.sign(user, SECRET_KEY);

describe('Test integracion Adoptme', function () {
    let createdCartId; // Variable para almacenar el ID del carrito creado
    let createdProductId; // Variable para almacenar el ID del producto creado

    describe('Test carts', function () {
        before(function () {
            createdCartId = null; // Inicializa createdCartId antes de las pruebas
            createdProductId = null; // Inicializa createdProductId antes de las pruebas
        });

        it('POST /api/cart debe crear correctamente un carrito', async function () {
            const { statusCode, ok, body } = await requester
                .post('/api/cart')
                .set('Cookie', [`auth=${token}`]) // Configura la cookie con el token JWT
                .send({ userId: 'testuser@example.com' }); // Enviar userId para crear el carrito

            //console.log('Response body:', body); // Verifica la estructura completa del cuerpo de la respuesta
            expect(statusCode).to.equal(200); // Asegúrate de que el código de estado sea 200
            expect(ok).to.be.true; // Asegúrate de que la solicitud fue exitosa
            expect(body).to.have.property('payload'); // Verifica que el cuerpo tenga la propiedad 'payload'
            expect(body.payload).to.be.an('object'); // Verifica que 'payload' sea un objeto
            expect(body.payload).to.have.property('_id'); // Verifica que 'payload' tenga la propiedad '_id'

            // Asigna el ID del carrito creado a createdCartId
            createdCartId = body.payload._id;
            //console.log('Created Cart ID:', createdCartId); // Log adicional para verificar el ID
        });

        it('POST /api/cart/:cid/products/:pid debe agregar un producto al carrito', async function () {
            const createdProduct = await requester
                .post('/api/products')
                .set('Cookie', [`auth=${token}`]) // Configura la cookie con el token JWT
                .send(testProduct);
            createdProductId = createdProduct.body.payload._id; // Asigna el ID del producto creado
            //console.log('Created Product ID:', createdProductId); // Log adicional para verificar el ID

            const { statusCode, ok, body } = await requester
                .post(`/api/cart/${createdCartId}/products/${createdProductId}`)
                .set('Cookie', [`auth=${token}`]); // Configura la cookie con el token JWT
            //console.log('Response body:', body); // Verifica la estructura completa del cuerpo de la respuesta
            expect(statusCode).to.equal(200); // Asegúrate de que el código de estado sea 200
            expect(ok).to.be.true; // Asegúrate de que la solicitud fue exitosa
            expect(body).to.have.property('payload'); // Verifica que el cuerpo tenga la propiedad 'payload'
        });

        it('PUT /api/cart/:cid/products/:pid debe actualizar la cantidad de un producto en el carrito', async function () {
            const { statusCode, ok, body } = await requester
                .put(`/api/cart/${createdCartId}/products/${createdProductId}`)
                .set('Cookie', [`auth=${token}`]) // Configura la cookie con el token JWT
                .send({ quantity: 100 }); // Actualiza la cantidad del producto en el carrito
            //console.log('Response body:', body); // Verifica la estructura completa del cuerpo de la respuesta
            expect(statusCode).to.equal(200); // Asegúrate de que el código de estado sea 200
            expect(ok).to.be.true; // Asegúrate de que la solicitud fue exitosa
            expect(body).to.have.property('payload'); // Verifica que el cuerpo tenga la propiedad 'payload'
            expect(body.payload).to.have.property('products'); // Verifica que 'payload' tenga la propiedad 'products'

            const product = body.payload.products.find(p => p.product == createdProductId);
            expect(product).to.have.property('quantity').that.equals(100); // Verifica que la cantidad se actualizó correctamente
        });

        it('DELETE /api/cart/:cid/products/:pid debe eliminar un producto del carrito', async function () {
            const { statusCode, ok, body } = await requester
                .delete(`/api/cart/${createdCartId}/products/${createdProductId}`)
                .set('Cookie', [`auth=${token}`]); // Configura la cookie con el token JWT
            //console.log('Response body:', body); // Verifica la estructura completa del cuerpo de la respuesta
            expect(statusCode).to.equal(200); // Asegúrate de que el código de estado sea 200
            expect(ok).to.be.true; // Asegúrate de que la solicitud fue exitosa
            expect(body).to.have.property('payload'); // Verifica que el cuerpo tenga la propiedad 'payload'
            expect(body.payload.products.find(p => p.product == createdProductId)) // Verifica que el producto fue eliminado
        });


    });
});
