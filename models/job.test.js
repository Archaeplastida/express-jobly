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
        expect(jobs).toEqual([{ id: testJobIds[0], title: "Job1", salary: 100, equity: "0.1", companyHandle: "c1", companyName: "C1", }, { id: testJobIds[1], title: "Job2", salary: 200, equity: "0.2", companyHandle: "c1", companyName: "C1", }, { id: testJobIds[2], title: "Job3", salary: 300, equity: "0", companyHandle: "c1", companyName: "C1", }, { id: testJobIds[3], title: "Job4", salary: null, equity: null, companyHandle: "c1", companyName: "C1", }]);
    })

    test("works with min salary", async () => {
        let jobs = await Job.findAll({ minSalary: 250 });
        expect(jobs).toEqual([{ id: testJobIds[2], title: "Job3", salary: 300, equity: "0", companyHandle: "c1", companyName: "C1", }])
    })

    test("works by equity", async () => {
        let jobs = await Job.findAll({ hasEquity: true });
        expect(jobs).toEqual([{ id: testJobIds[0], title: "Job1", salary: 100, equity: "0.1", companyHandle: "c1", companyName: "C1", }, { id: testJobIds[1], title: "Job2", salary: 200, equity: "0.2", companyHandle: "c1", companyName: "C1", }]);
    })

    test("works with min salary and equity", async () => {
        let jobs = await Job.findAll({ minSalary: 150, hasEquity: true });
        expect(jobs).toEqual([{ id: testJobIds[1], title: "Job2", salary: 200, equity: "0.2", companyHandle: "c1", companyName: "C1", }]);
    })

    test("works by name", async () => {
        let jobs = await Job.findAll({ title: "ob1" });
        expect(jobs).toEqual([{ id: testJobIds[0], title: "Job1", salary: 100, equity: "0.1", companyHandle: "c1", companyName: "C1", }]);
    })
})

//get

describe("get", () => {
    test("works as intended", async () => {
        let job = await Job.get(testJobIds[0]);
        expect(job).toEqual({ id: testJobIds[0], title: "Job1", salary: 100, equity: "0.1", company: { handle: "c1", name: "C1", description: "Desc1", numEmployees: 1, logoUrl: "http://c1.img", } });
    })

    test("throws notFound if job id isn't found", async () => {
        try {
            await Job.get(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

//update

describe("update", () => {
    let updateData = { title: "New", salary: 500, equity: "0.5" };

    test("works as intended", async () => {
        let job = await Job.update(testJobIds, updateData);
        expect(job).toEqual({ id: testJobIds[0], companyHandle: "c1", ...updateData, });
    })

    test("throws notFound if job id isn't found", async () => {
        try {
            await Job.update(0, {title: "this is a title which won't work."});
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })

    test("bad request with no data", async () => {
        try {
            await Job.update(testJobIds[0], {}); //no data
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
})