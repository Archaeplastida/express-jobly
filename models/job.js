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

    static async findAll(searchFilters = {}) {
        const { minSalary, hasEquity, title } = searchFilters;
        let query = `SELECT jobs.id, jobs.title, jobs.salary, jobs.equity, jobs.company_handle AS "companyHandle", companies.name AS "companyName" FROM jobs LEFT JOIN companies ON companies.handle = jobs.company_handle`, conditionals = [], queryVals = [];

        if (minSalary !== undefined) {
            queryVals.push(minSalary);
            conditionals.push(`salary >= $${queryVals.length}`);
        }

        if (hasEquity === true) conditionals.push(`equity > 0`);

        if (title !== undefined) {
            queryVals.push(`%${title}%`);
            conditionals.push(`title ILIKE $${queryVals.length}`);
        }

        if (conditionals.length > 0) query += " WHERE " + conditionals.join(" AND ");

        query += " ORDER BY title";
        const result = await db.query(query, queryVals);
        return result.rows;
    }

    // Returns data of a job, based on the id given.
    // Returns { id, title, salary, equity, companyHandle, company } where the company is { handle, name, description, numEmployees, logoUrl }
    // If an id doesn't yield a company, then it shall throw NotFoundError.

    static async get(id) {
        const jobResult = await db.query(`SELECT id, title, salary, equity, company_handle AS "companyHandle" FROM jobs WHERE id = $1`, [id]), job = jobResult.rows[0];
        if (!job) throw new NotFoundError(`Job ID ${id} doesn't exist.`);

        const companyResult = await db.query(`SELECT handle, name, description, num_employees AS "numEmployee", logo_url AS "logoUrl" FROM companies WHERE handle = $1`, [job.companyHandle]);
        delete job.companyHandle;
        job.company = companyResult.rows[0];

        return job;
    }

    // Update job data with data given, this would technically be a parital update, meaning it's fine if the data doesn't contain all of the fields; it dynamically changes only the provided ones.
    // Data can have: {title, salary, equity}
    // Returns { id, title, salary equity, companyHandle }
    // If the id given isn't found, you obviously won't be able to edit it, so you'll get NotFoundError thrown at you.

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {}), idIndex = "$" + (values.length + 1);
        const result = await data.query(`UPDATE jobs SET ${setCols} WHERE id = ${idVarIdx} RETURNING id, title, salary, equity, company_handle AS "companyHandle"`, [...values, id]);
        if (!result.rows[0]) throw new NotFoundError(`Job ID ${id} doesn't exist.`);

        return result.rows[0];
    }

    // Deletes data of a job, based on the id given.
    // If an id doesn't yield any results, throw NotFoundError.

    static async remove(id) {
        const result = db.query(`DELETE FROM jobs WHERE id = $1 RETURNING id`, [id]);
        if (!result.rows[0]) throw new NotFoundError(`Job ID ${id} doesn't exist.`);
    }
}

module.exports = Job;