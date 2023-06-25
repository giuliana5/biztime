// Test for invoices routes

const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

beforeEach(createData);

afterAll(async () => {
    await db.end();
});

describe("GET /", function () {
    test("Should respond w/ array of invoices", async function () {
        const resp = await request(app).get("/invoices");
        expect(resp.body).toEqual({
            "invoices": [
                {id: 1, comp_code: "apple"},
                {id: 2, comp_code: "apple"},
                {id: 3, comp_code: "ibm"}
            ]
        });
    });
});

describe("GET /1", function () {
    test("Should return invoice information", async function () {
        const resp = await request(app).get("/invoices/1");
        expect(resp.body).toEqual(
            {
                "invoices": {
                    id: 1,
                    amt: 100,
                    add_date: '2018-01-01T08:00:00.000Z',
                    paid: false,
                    paid_date: null,
                    company: {
                        code: 'apple',
                        name: 'Apple',
                        description: 'Maker of OSX.'
                    }
                }
            }
        );
    });

    test("Should return 404 for an invalid invoice", async function () {
        const resp = await request(app).get("/invoices/532");
        expect(resp.status).toEqual(404);
    });
});

describe("POST /", function () {
    test("Should add an invoice", async function () {
        const resp = await request(app)
            .post("/invoices")
            .send({amt: 400, comp_code: 'ibm'});

        expect(resp.body).toEqual(
            {
                "invoice": {
                    id: 4,
                    comp_code: "ibm",
                    amt: 400,
                    add_date: expect.any(String),
                    paid: false,
                    paid_date: null
                }
            }
        );
    });
});

describe("PUT /", function () {
    test("Should update an invoice", async function () {
        const resp = await request(app)
            .put("/invoices/1")
            .send({amt: 1000, paid: false});
        
            expect(resp.body).toEqual(
                {
                    "invoice": {
                        id: 1,
                        comp_code: 'apple',
                        paid: false,
                        amt: 1000,
                        add_date: expect.any(String),
                        paid_date: null
                    }
                }
            );
    });

    test("Should return 404 for an invalid invoice", async function () {
        const resp = await request(app)
            .put("/invoices/532")
            .send({amt: 1000});

        expect(resp.status).toEqual(404);
    });

    test("It should return 500 for missing data", async function () {
        const resp = await request(app)
            .put("/invoices/1")
            .send({});

        expect(resp.status).toEqual(500);
    });
});

describe("DELETE /", function () {
    test("Should delete an invoice", async function () {
        const resp = await request(app)
            .delete("/invoices/1");

        expect(resp.body).toEqual({"status": "deleted"});
    });

    test("Should return 404 for an invalid invoice", async function () {
        const resp = await request(app)
            .delete("/invoices/569");

        expect(resp.status).toEqual(404);
    });
});
