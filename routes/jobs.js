"use strict";

const jsonschema = require("jsonschema"), express = require("express"), { BadRequestError } = require("../expressError"), { ensureAdmin } = require("../middleware/auth"), Job = require("../models/job");
const jobSchemaNew = require("../schemas/jobNew.json"), jobSchemaUpdate = require("../schemas/jobUpdate.json"), jobSchemaSearch = require("../schemas/jobSearch.json");

const router = express.Router({ mergeParams: true })

//Adds a job into the database, however it can only be done by admin.
router.post("/", ensureAdmin, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, jobSchemaNew);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
})

//Gets a list of jobs, with an optional filter using query string.
router.get("/", async (req, res, next) => {
    const query = req.query;
    if (query.minSalary !== undefined) query.minSalary = +query.minSalary;
    query.hasEquity = query.hasEquity === "true";

    try {
        const validator = jsonschema.validate(query, jobSchemaSearch);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const jobs = await Job.findAll(query);
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
})

//Gets a job via id.
router.get("/:id", async (req, res, next) => {
    try {
        const job = await Job.get(req.params.id);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
})

//Updates a job, but you must be admin to use it.
router.patch("/:id", ensureAdmin, async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, jobSchemaUpdate);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
})

//Deletes a job, but you must be admin to use it.
router.delete("/:id", ensureAdmin, async (req, res, next) => {
    try {
        await Job.remove(req.params.id);
        return res.json({ deleted: +req.params.id });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;