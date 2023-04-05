const request = require('supertest');
const app = require('./../app');
const db = require('./../db/connection');
const userData = require('./../db/data/test-data/users');
const seed = require('./../db/seeds/seed');

beforeEach(() => {
    return seed(userData);
});

afterAll(() => {
    return db.end();
});

describe("/api/users", () => {
    test("GET: 200 - serves an array of all users", () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then((res) => {
                const { users } = res.body;
                users.forEach((user) => {
                    expect(user).toMatchObject({
                        email: expect.any(String),
                        password: expect.any(String),
                        photo: expect.any(String),
                        name: expect.any(String),
                        bio: expect.any(String),
                        phone: expect.any(String)
                    });
                });
                expect(users.length).toBe(4);
            });
    });
});