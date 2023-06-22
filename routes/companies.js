// Routes for companies.

const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();

router.get("/", async function (req, res, next) {
    try {
        const result = await db.query(
            `SELECT code, name 
            FROM companies 
            ORDER BY name`
        );

        return res.json({"companies": result.rows});
    } catch (err) {
        return next(err);
    }
});

router.get("/:code", async function (req, res, next) {
    try {
        const result = await db.query(
            `SELECT code, name, description
            FROM companies
            WHERE code = $1`, [code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Company not found: ${code}`, 404);
        }

        const company = result.rows[0];

        return res.json({"company": company});

    } catch(err) {
        return next(err);
    }
})

module.exports = router;
