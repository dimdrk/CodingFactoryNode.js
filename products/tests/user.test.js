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

describe("Tests for /api/users requests", () => {
    it("GET /api/users", async() => {
        const result = await request(app).get("/api/users");

        expect(result.statusCode).toBe(200);
        expect(result.body.status).toBeTruthy();
        expect(result.body.data.length).toBeGreaterThan(0);
    }, 10000);

    it("POST /api/users", async() => {
        const result = await request(app).post("/api/users")
            .send({
                username: "test4",
                password: "12345",
                name: "test4name",
                surname: "test4surname",
                email: "test4@aueb.gr",
                address: {
                    area: "area44",
                    road: "road44"
                }
            });

        expect(result.statusCode).toBe(200);
        expect(result.body.status).toBeTruthy();
        expect(result.body.data).toBeTruthy();
    }, 10000);
});

describe("For /api/users/{username} requests", () => {
    it("GET /api/users/{username}", async() => {
        const res = await helpers.findLastInsertedUser();
        console.log(res.username);
        const result = await request(app).get('/api/users/' + res.username);

        expect(result.statusCode).toBe(200);
        expect(result.body.status).toBeTruthy();
        expect(result.body.data.username).toBe(res.username);
        expect(result.body.data.email).toBe(res.email);
    }, 10000);

    it("DELETE /api/users/{username}", async() => {
        const res = await helpers.findLastInsertedUser();
        console.log(res.username);
        const result = await request(app).delete('/api/users/' + res.username);

        expect(result.statusCode).toBe(200);
        expect(result.body.status).toBeTruthy();
    }, 10000);
});