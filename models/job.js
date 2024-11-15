"use strict";

const db = require("../db"), { NotFoundError } = require("../expressError"), { sqlForPartialUpdate } = require("../helpers/sql");

class Job {
    // Create a job from given data, then update the db to then return new job data.
    // data format: { title, salary, equity, companyHandle }
    // data return format: { id, title, salary, equity, companyHandle }

    static async create(data) {
        const result = await db.query(`INSERT INTO jobs (title, salary, equity, company_handle) VALUES ($1, $2, $3, $4) RETURNING id, title, salary, equity, company_handle AS "companyHandle"`, [data.title, data.salary, data.equity, data.companyHandle]);
        let newJob = result.rows[0];
        return newJob;
    }
}