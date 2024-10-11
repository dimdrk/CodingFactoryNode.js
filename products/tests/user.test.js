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
    });

    it("POST /api/users request", async() => {
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
    });

    it("POST /api/users request check for existing user", async() => {
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
        expect(result.body.status).toBeFalsy();
    });
});

describe("For /api/users/{username} requests", () => {
    it("GET /api/users/{username}", async() => {
        const res = await helpers.findLastInsertedUser();
        console.log(res);
        const result = await request(app).get('/api/users/' + res.username);

        expect(result.statusCode).toBe(200);
        expect(result.body.status).toBeTruthy();
        expect(result.body.data.username).toBe(res.username);
        expect(result.body.data.email).toBe(res.email);
    });

    it("PATCH for api/users/{username}", async () => {
        const result = await helpers.findLastInsertedUser();
        const res = await request(app)
            .patch('/api/users/' + result.username)
            .send({
                name: "new test4",
                surname: "new test4",
                email: "xxx@aueb.gr",
                address: {
                    area: "new area",
                    road: "new road"
                }
            });
        console.log(res.body.data);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.name).toBe("new test4");
        expect(res.body.data.surname).toBe("new test4");
    })

    it("DELETE /api/users/{username}", async() => {
        const res = await helpers.findLastInsertedUser();
        console.log(res.username);
        const result = await request(app).delete('/api/users/' + res.username);

        expect(result.statusCode).toBe(200);
        expect(result.body.status).toBeTruthy();
    });
});