"use strict";

const jsonschema = require("jsonschema"), express = require("express"), { BadRequestError } = require("../expressError"), { ensureAdmin } = require("../middleware/auth"), Job = require("../models/job");
const jobSchemaNew = require("../schemas/jobNew.json"), jobSchemaUpdate = require("../schemas/jobUpdate.json"), jobSchemaSearch = require("../schemas/jobSearch.json");

const router = express.Router({ mergeParams: true })

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

router.get("/", async (req, res, next) => {
    const query = req.query;
    if (query.minSalary !== undefined) query.minSalary = +query.minSalary;
    query.hasEquity = q.hasEquity === "true";

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

module.exports = router;