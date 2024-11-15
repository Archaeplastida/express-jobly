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

    test("bad request with missing data", async function () {
        const resp = await request(app).post(`/jobs`).send({ companyHandle: "c1", }).set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app).post(`/jobs`).send({ companyHandle: "c1", title: "J-new", salary: "not-a-number", equity: "0.2", }).set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });
});

describe("GET /jobs", function () {
    test("ok for anon", async function () {
        const resp = await request(app).get(`/jobs`);
        expect(resp.body).toEqual({ jobs: [{ id: expect.any(Number), title: "J1", salary: 1, equity: "0.1", companyHandle: "c1", companyName: "C1", }, { id: expect.any(Number), title: "J2", salary: 2, equity: "0.2", companyHandle: "c1", companyName: "C1", }, { id: expect.any(Number), title: "J3", salary: 3, equity: null, companyHandle: "c1", companyName: "C1" }] });
    });

    test("works: filtering", async function () {
        const resp = await request(app).get(`/jobs`).query({ hasEquity: true });
        expect(resp.body).toEqual({ jobs: [{ id: expect.any(Number), title: "J1", salary: 1, equity: "0.1", companyHandle: "c1", companyName: "C1", }, { id: expect.any(Number), title: "J2", salary: 2, equity: "0.2", companyHandle: "c1", companyName: "C1" }] });
    });

    test("works: filtering on 2 filters", async function () {
        const resp = await request(app).get(`/jobs`).query({ minSalary: 2, title: "3" });
        expect(resp.body).toEqual({ jobs: [{ id: expect.any(Number), title: "J3", salary: 3, equity: null, companyHandle: "c1", companyName: "C1" }] });
    });

    test("bad request on invalid filter key", async function () {
        const resp = await request(app).get(`/jobs`).query({ minSalary: 2, nope: "nope" });
        expect(resp.statusCode).toEqual(400);
    });
});

describe("GET /jobs/:id", function () {
    test("works for anon", async function () {
        const resp = await request(app).get(`/jobs/${testJobIds[0]}`);
        expect(resp.body).toEqual({ job: { id: testJobIds[0], title: "J1", salary: 1, equity: "0.1", company: { handle: "c1", name: "C1", description: "Desc1", numEmployees: 1, logoUrl: "http://c1.img" } } });
    });

    test("not found for no such job", async function () {
        const resp = await request(app).get(`/jobs/0`);
        expect(resp.statusCode).toEqual(404);
    });
});