const request = require('supertest');
const app = require('../app');

const { hashPassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { sequelize } = require('../models');
const queryInterface = sequelize.getQueryInterface();

let users = require('../data/user.json');

let accessToken;
beforeAll(async () => {
    users.forEach(el => {
        delete el.id;
        el.password = hashPassword(el.password);
        el.updatedAt = el.createdAt = new Date();
    })

    await queryInterface.bulkInsert('Users', users, {});

    const user_login = {
        email: 'sarah@mail.com',
        password: '123456'
    }

    accessToken = signToken(user_login)
})

afterAll(async () => {
    await queryInterface.bulkDelete('Users', null, { truncate: true, cascade: true, restartIdentity: true });
})

describe('User Controller', () => {
    describe('POST /user/register', () => {
        it('should success register a new user', async () => {
            const res = await request(app)
                .post('/user/register')
                .send({
                    name: 'Saraswati',
                    picture: 'https://example.com/sarah.jpg',
                    email: 'sarah1@mail.com',
                    password: '123456'
                })

            expect(res.status).toBe(201)
            expect(res.body.message).toBe('Success added new account')
        })
        it('should error bad request register a new user', async () => {
            const res = await request(app)
                .post('/user/register')
                .send({
                    picture: 'https://example.com/sarah.jpg',
                    email: 'sarah1@mail.com',
                    password: '123456'
                })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('name is required')
        })
        it('should error bad request register a new user', async () => {
            const res = await request(app)
                .post('/user/register')
                .send({
                    name: 'Saraswati',
                    picture: 'https://example.com/sarah.jpg',
                    password: '123456'
                })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('email is required')
        })
        it('should error bad request register a new user', async () => {
            const res = await request(app)
                .post('/user/register')
                .send({
                    name: 'Saraswati',
                    picture: 'https://example.com/sarah.jpg',
                    email: 'sarah1@mail.com'
                })

            expect(res.status).toBe(400)
            expect(res.body.message).toBe('password is required')
        })
        it('should Success login into account', async () => {
            const res = await request(app)
                .post('/user/login')
                .send({
                    email: 'sarah@mail.com',
                    password: '123456'
                })

            expect(res.status).toBe(200)
            expect(res.body.message).toBe('Success login')
        })
        it('should error because of wrong password login into account', async () => {
            const res = await request(app)
                .post('/user/login')
                .send({
                    email: 'sarah@mail.com',
                    password: '1234567'
                })

            expect(res.status).toBe(401)
            expect(res.body.message).toBe('Invalid email or password')
        })
        it('should error because of wrong email login into account', async () => {
            const res = await request(app)
                .post('/user/login')
                .send({
                    email: 'sarah12@mail.com',
                    password: '123456'
                })

            expect(res.status).toBe(404)
            expect(res.body.message).toBe('Data not found')
        })
    })
})