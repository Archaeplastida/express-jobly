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

module.exports = router;