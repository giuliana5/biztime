// Routes for companies.

const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");
const slugify = require("slugify");

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
});

router.post("/", async function (req, res, next) {
    try {
        let {name, description} = req.body;
        let code = slugify(name, {lower: true});

        const result = await db.query(
            `INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description` [code, name, description]
        );

        return res.status(201).json({"company": result.rows[0]});
    } catch(err) {
        return next(err);
    }
});

module.exports = router;
