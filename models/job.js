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

    // Find all jobs with optional filter.
    // searchFilter (optional): minSalary, hasEquity, title (case insensitive)
    // returns [{ id, title, salary, equity, companyHandle, companyName }, ...]

    static async findAll(searchFilters = {}){
        const { minSalary, hasEquity, title } = searchFilters;
        let query = `SELECT jobs.id, jobs.title, jobs.salary, jobs.equity, jobs.company_handle AS "companyHandle", companies.name AS "companyName" FROM jobs LEFT JOIN companies ON companies.handle = jobs.company_handle`, conditionals = [], queryVals = [];

        if(minSalary !== undefined) {
            queryVals.push(minSalary);
            conditionals.push(`salary >= $${queryVals.length}`);
        }

        if(hasEquity === true) conditionals.push(`equity > 0`);

        if(title !== undefined) {
            queryVals.push(`%${title}%`);
            conditionals.push(`title ILIKE $${queryVals.length}`);
        }

        if (conditionals.length > 0) query += " WHERE " + conditionals.join(" AND ");

        query += " ORDER BY title";
        const result = await db.query(query, queryVals);
        return result.rows;
    }
}