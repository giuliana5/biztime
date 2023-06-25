// Test for companies routes.

const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

beforeEach(createData);

afterAll(async () => {
    await db.end()
});

describe("GET /", function () {
    test("Should respond w/ array of companies", async function () {
        const resp = await request(app).get("/companies");
        expect(resp.body).toEqual({
            "companies": [
                {code: "apple", name: "Apple"},
                {code: "ibm", name: "IBM"},
            ]
        });
    });
});

describe("GET /apple", function () {
    test("It return company info", async function () {
        const resp = await request(app).get("/companies/apple");
        expect(resp.body).toEqual(
            {
                "company": {
                    code: "apple",
                    name: "Apple",
                    description: "Maker of OSX.",
                    invoices: [1, 2]
                }
            }
        );
    });

    test("Should return 404 for no-such company", async function () {
        const resp = await request(app).get("/companies/asdj");
        expect(resp.status).toEqual(404);
    });
});

describe("POST /", function () {
    test("Should add a company", async function () {
        const resp = await request(app)
            .post("/companies")
            .send({name: "Taco Bell", description: "Bong"});

        expect(resp.body).toEqual(
            {
                "company": {
                    code: "tacobell",
                    name: "Taco Bell",
                    description: "Bong"
                }
            }
        );
    });

    test("Should return 500", async function () {
        const resp = await request(app)
            .post("/companies")
            .send({name: "Apple", description: "asdf"});

        expect(resp.status).toEqual(500);
    });
});

describe("PUT /", function () {
    test("Should update a company", async function () {
        const resp = await request(app)
            .put("/companies/apple")
            .send({name: "Apple 2.0", description: "Amped up Apple"});

        expect(resp.body).toEqual(
            {
                "company": {
                    code: "apple",
                    name: "Apple 2.0",
                    description: "Amped up Apple"
                }
            }
        );
    });

    test("Should return 404 for a non valid company", async function () {
        const resp = await request(app)
            .put("/companies/asdf")
            .send({name: "asdk"});

        expect(resp.status).toEqual(404);
    });

    test("Should return 500 for missing data", async function () {
        const resp = await request(app)
            .put("/companies/apple")
            .send({});

        expect(resp.status).toEqual(500);
    });
});

describe("DELETE /", function () {
    test("Should delete a company", async function () {
        const resp = await request(app)
        .delete("/companies/apple");

    expect(resp.body).toEqual({"status": "deleted"});
    });

    test("Should return 404 for an invalid company", async function () {
        const resp = await request(app)
        .delete("/companies/asdfk");

    expect(resp.status).toEqual(404);
    });
});
