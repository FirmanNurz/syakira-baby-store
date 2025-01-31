const request = require('supertest');
const app = require('../app');

const { hashPassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { sequelize } = require('../models');
const queryInterface = sequelize.getQueryInterface();

let product = require('../data/product.json');

let accessToken;
beforeAll(async () => {
  //seeding product
    product.forEach(el => {
        delete el.id;
        el.updatedAt = el.createdAt = new Date();
    })

    await queryInterface.bulkInsert('Products', product, {});

    const user_login = {
        email: 'sarah@mail.com',
        password: '123456'
    }

    accessToken = signToken(user_login)
})

afterAll(async () => {
    await queryInterface.bulkDelete('Products', null, { truncate: true, cascade: true, restartIdentity: true });
})

describe('Product Controller', () => {
    describe('GET /product', () => {
        it('should success get all product', async () => {
            const res = await request(app)
                .get('/products')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('product')
        })
    })
    describe('GET /product/:id', () => {
        it('should success get one product', async () => {
            const res = await request(app)
                .get('/products/1')

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('product')
        })
        it('should error not found get one product', async () => {
            const res = await request(app)
                .get('/products/1000')
               

            expect(res.status).toBe(404)
            expect(res.body.message).toBe('Not Found')
        })
        it('should error bad request get one product', async () => {
            const res = await request(app)
                .get('/products/abc')

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('Product ID harus berupa angka')
        })
    })
    describe('GET /product/gemini', () => {
        it('should success get gemini product', async () => {
            const res = await request(app)
                .get('/products/gemini')

            expect(res.status).toBe(200)
        })
    })
})