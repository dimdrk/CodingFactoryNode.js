const mongoose = require("mongoose");
const request = require("supertest");
const app = require('../index');
const helpers = require('../services/user.service');

beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(
            () => { console.log("Connection to Mongo from Jest established.") },
            err => { console.log("Failed to connect to Mongo from Jest.") },
        )
})

afterEach(async () => {
    await mongoose.connection.close();
})

describe("Tests for /api/user-product/users/products requests", () => {
    it("GET for /api/user-product/users/products", async() => {
        const result = await request(app)
            .get("/api/user-product/users/products");

        expect(result.statusCode).toBe(200);
        expect(result.body.status).toBeTruthy();
        expect(result.body.data.length).toBeGreaterThan(0);
    });
});

describe("Tests for /api/user-product/{username}}/products requests", () => {
    it("GET for /api/user-product/{username}/products", async() => {
        const result = await request(app)
            .get("/api/user-product/user3/products");

        expect(result.statusCode).toBe(200);
        expect(result.body.status).toBeTruthy();
        expect(result.body.data.username).toBe('user3');
        expect(result.body.data.products.length).toBeGreaterThan(0);
    });

    it("POST for /api/user-product/{username}/products", async() => {
        const res = await helpers.findLastInsertedUser();
        const username = res.username;
        const result = await request(app)
            .post('/api/user-product/'+ username +'/products')
            .send({
                username: username,
                products: [{
                    product: "new product",
                    quantity: 20,
                    cost: 10
                }]
            });

        expect(result.statusCode).toBe(200);
        expect(result.body.status).toBeTruthy();
    });
});

describe("Tests for /api/user-product/{username}/products/{id} requests", () => {
    it("PATCH for /api/user-product/{username}/products/{id}", async() => {
        let result = await helpers.findLastInsertedUser();
        const username = result.username;
        // const res = await helpers.findUsersProduct('user3', "670e617f6a0f86424599fe84");
        const product = await helpers.findUsersProduct(username);
        // username = res.username;
        // id = res.products[0]._id;
        id = product.products[0]._id;

        const res = await request(app)
            .patch('/api/user-product/' + username + '/products/' + id)
            .send({
                username: result.username,
                product: {
                    quantity: 180
                }
            })
        result = await helpers.findLastInsertedUser();
        expect(res.statusCode).toBe(200);
        expect(result.products[0].quantity).toBe(180);
    });

    it("DELETE for /api/user-product/{username}/products/{id}", async() => {
        let result = await helpers.findLastInsertedUser();
        const username = result.username;
        const id = result.products[0]._id;

        const res = await request(app)
            .delete('/api/user-product/' + username + '/products/' + id)

        result = await helpers.findLastInsertedUser();
        console.log(result);
        expect(res.statusCode).toBe(200);
        expect(result.products.length).toBe(0);
    });
});