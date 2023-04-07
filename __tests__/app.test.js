const request = require("supertest");
const app = require("./../app");
const db = require("./../db/connection");
const userData = require("./../db/data/test-data/users");
const seed = require("./../db/seeds/seed");

beforeEach(() => {
  return seed(userData);
});

afterAll(() => {
  return db.end();
});

describe("/api/users", () => {
  test("POST: 201 - registers a user and saves them to the db", () => {
    const newUser = {
      email: "jimmyaliyu1@gmail.com",
      password: "joelali5",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        console.log(body.user);
        expect(body.user).toMatchObject({
          user_id: expect.any(Number),
          email: expect.any(String),
          password: expect.any(String),
          photo: expect.any(String),
          name: expect.any(String),
          bio: expect.any(String),
          phone: expect.any(String),
        });
      });
  });
});

describe("/api/users", () => {
  test("GET: 200 - serves an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const { users } = res.body;
        users.forEach((user) => {
          expect(user).toMatchObject({
            user_id: expect.any(Number),
            email: expect.any(String),
            password: expect.any(String),
            photo: expect.any(String),
            name: expect.any(String),
            bio: expect.any(String),
            phone: expect.any(String),
          });
        });
        expect(users.length).toBe(4);
      });
  });
});
