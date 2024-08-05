import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');
const testUser = {first_name: 'Juan', last_name: 'Tomaselli', email: 'jselli@gmail.com',age: 33, password: 'abc123'}
let cookie;

describe('Testing Adopme', function() {
    describe('Test Users', function () {
        before(function () {});
        beforeEach(function () {});
        after(function () {});
        afterEach(function () {});

        it('POST /api/users/register debe registrar un nuevo usuario', async function () {
            const { statusCode, ok, _body } = await requester.post('/api/users/register').send(testUser);
            //console.log(_body)
            expect(_body.payload).to.be.ok;
            expect(_body.payload).to.have.property('_id')
        });   
        
        it('POST /api/users/login debe loguear correctamente al usuario', async function () {
            const result = await requester.post('/api/users/login').send(testUser);
            const cookieData = result.header['set-cookie'][0];
            cookie = {name: cookieData.split('=')[0], value: cookieData.split('=')[1]};
       
            expect(cookieData).to.be.ok;
            expect(cookie.name).to.be.equals('auth');
            expect(cookie.value).to.be.ok;
        });
        
        it('POST /api/users/current debe devolver datos correctos de usuario',async function () {
            const {_body} = await requester.get('/api/users/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
            //console.log(_body)
            expect(_body.payload.user).to.have.property('_id');
            expect(_body.payload.user).to.have.property('first_name');
            expect(_body.payload.user).to.have.property('last_name');
            expect(_body.payload.user).to.have.property('email').and.to.be.equals(testUser.email)
        });

    });
});