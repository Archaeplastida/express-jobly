"use strict"

const { NotFoundError, BadRequestError } = require("../expressError"), db = require("../db.js"), Job = require("./job.js"), { commonBeforeAll, commonBeforeEach, commonAfterAll, commonAfterEach, testJobIds } = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

//create

describe("create", () => {
    let newJob = { companyHandle: "newJob", title: "testJob", salary: 900, equity: 0.2 }

    test("works as intended", async () => {
        let job = await Job.create(newJob);
        expect(job).toEqual({ ...newJob, id: expect.any(Number) });
    })
})