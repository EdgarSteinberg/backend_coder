
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
    let createdProductId; // Variable para almacenar el ID del producto creado

    describe('Test Products', function () {
        before(function () {
            createdProductId = null; // Inicializa createdProductId antes de las pruebas
        });
        beforeEach(function () { });
        after(function () { });
        afterEach(function () { });

        it('POST /api/products debe cargar correctamente un producto', async function () {
            const { statusCode, ok, body } = await requester
                .post('/api/products')
                .set('Cookie', [`auth=${token}`]) // Configura la cookie con el token JWT
                .send(testProduct);
            //console.log(body); // Verifica la estructura completa del cuerpo de la respuesta
            expect(statusCode).to.equal(200); // Asegúrate de que el código de estado sea 200
            expect(ok).to.be.true; // Asegúrate de que la solicitud fue exitosa
            expect(body).to.have.property('payload'); // Verifica que el cuerpo tenga la propiedad 'payload'
            expect(body.payload).to.have.property('_id'); // Verifica que 'payload' tenga la propiedad '_id'

            // Asigna el ID del producto creado a createdProductId
            createdProductId = body.payload._id;
        });

        it('GET /api/products debe retornar un array de productos', async function () {
            const result = await requester.get('/api/products');  // Realiza una solicitud GET para obtener los productos
            const body = result.body; // Accedemos al cuerpo de la respuesta usando result.body

            //console.log(body); // Imprime el cuerpo de la respuesta para verificar su estructura
            expect(body).to.have.property('status').to.equal('success');// Verificamos que la respuesta tenga el estado 'success'
            expect(body).to.have.property('payload').to.be.an('object');// Verificamos que exista un payload y que sea un objeto
            expect(body.payload).to.have.property('products').to.be.an('object');// Verificamos que dentro del payload exista un objeto 'products'
            expect(body.payload.products).to.have.property('payload').to.be.an('array');// Verificamos que dentro de 'products' exista un array llamado 'payload'
        });

        it('PUT /api/products debe actualizar correctamente un producto', async function () {
            const updatedProduct = { title: 'JackDanielsHoney', price: 120 };

            // Realiza una solicitud PUT para actualizar el producto
            const result = await requester
                .put(`/api/products/${createdProductId}`)
                .set('Cookie', [`auth=${token}`]) // Configura la cookie con el token JWT
                .send(updatedProduct);

            //console.log(result.body); // Verifica el cuerpo de la respuesta

            expect(result.status).to.equal(200); // Verifica que la solicitud PUT sea exitosa (código de estado 200)
            // Verifica que el producto se haya actualizado correctamente
            expect(result.body).to.have.property('status').to.equal('success');
            expect(result.body).to.have.property('payload').to.be.an('object');
            //expect(result.payload.title).to.be.equal(updatedProduct)
            expect(result.body.payload).to.have.property('acknowledged').to.be.true;
            expect(result.body.payload).to.have.property('modifiedCount').to.equal(1);
            expect(result.body.payload).to.have.property('matchedCount').to.equal(1);
        });

        it('DELETE /api/products debe eliminar correctamente un producto', async function () {
            // Realiza una solicitud DELETE para eliminar el producto
            const deleteResult = await requester
                .delete(`/api/products/${createdProductId}`)
                .set('Cookie', [`auth=${token}`]);

            //console.log(deleteResult.body); // Verifica el cuerpo de la respuesta

            // Verifica que la solicitud DELETE haya sido exitosa
            expect(deleteResult.status).to.equal(200);
            expect(deleteResult.body).to.have.property('status').to.equal('success');


        });
    });
});
