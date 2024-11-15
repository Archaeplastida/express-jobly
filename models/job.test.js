"use strict"

const { NotFoundError, BadRequestError } = require("../expressError"), db = require("../db.js"), Job = require("./job.js"), { commonBeforeAll, commonBeforeEach, commonAfterAll, commonAfterEach, testJobIds } = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

//create

describe("create", () => {
    let newJob = { companyHandle: "c1", title: "testJob", salary: 900, equity: "0.2" };

    test("works as intended", async () => {
        let job = await Job.create(newJob);
        expect(job).toEqual({ ...newJob, id: expect.any(Number) });
    })
})

//findAll

describe("findAll", () => {
    test("works with no filter", async () => {
        let jobs = await Job.findAll();
        expect(jobs).toEqual([{ id: testJobIds[0], title: "Job1", salary: 100, equity: "0.1", companyHandle: "c1", companyName: "C1", }, { id: testJobIds[1], title: "Job2", salary: 200, equity: "0.2", companyHandle: "c1", companyName: "C1", }, { id: testJobIds[2], title: "Job3", salary: 300, equity: "0", companyHandle: "c1", companyName: "C1", }, { id: testJobIds[3], title: "Job4", salary: null, equity: null, companyHandle: "c1", companyName: "C1", }])
    })

    test("works with min salary", async () => {
        let jobs = await Job.findAll({ minSalary: 250 });
        expect(jobs).toEqual([{ id: testJobIds[2], title: "Job3", salary: 300, equity: "0", companyHandle: "c1", companyName: "C1", }])
    })

    test("works by equity", async () => {
        let jobs = await Job.findAll({ hasEquity: true });
        expect(jobs).toEqual([{ id: testJobIds[0], title: "Job1", salary: 100, equity: "0.1", companyHandle: "c1", companyName: "C1", }, { id: testJobIds[1], title: "Job2", salary: 200, equity: "0.2", companyHandle: "c1", companyName: "C1", }])
    })

    test("works with min salary and equity", async () => {
        let jobs = await Job.findAll({ minSalary: 150, hasEquity: true });
        expect(jobs).toEqual([{ id: testJobIds[1], title: "Job2", salary: 200, equity: "0.2", companyHandle: "c1", companyName: "C1", }]);
    })
})