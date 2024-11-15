"use strict.";

const request = require("supertest"), app = require("../app"), { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, testJobIds, u1Token, adminToken, } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);