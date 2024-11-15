"use strict.";

const request = require("supertest"), app = require("../app"), { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, testJobIds, u1Token, adminToken, } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

describe("POST /jobs", function () {
    test("ok for admin", async function () {
        const resp = await request(app).post(`/jobs`).send({ companyHandle: "c1", title: "J-new", salary: 10, equity: "0.2" }).set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({ job: { id: expect.any(Number), title: "J-new", salary: 10, equity: "0.2", companyHandle: "c1" } });
    });

    test("unauth for users", async function () {
        const resp = await request(app).post(`/jobs`).send({ companyHandle: "c1", title: "J-new", salary: 10, equity: "0.2", }).set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401);
    });
});