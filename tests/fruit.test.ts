import app from "../src/app";
import supertest from "supertest";
import { createFruitInputObject, insertFruit } from "./factories/fruit.factory";
import fruits from '../src/data/fruits';

const api = supertest(app);

beforeEach(() => {
    fruits.length = 0;
    //fruits.splice(0, fruits.length);
});

describe("testing POST /fruits", () => {
    it("should return 201 when inserting a fruit", async () => {
        const fruit = createFruitInputObject("Banana", 3);
        const { status } = await api.post("/fruits").send(fruit);

        expect(status).toBe(201);
    });

    it("should return 409 when inserting a fruit that is already registered", async () => {
        insertFruit("Pera", 1.75);
        const fruit = createFruitInputObject("Pera", 1.75);
        const { status } = await api.post("/fruits").send(fruit);

        expect(status).toBe(409);
    });

    it("should return 422 when inserting a fruit with data missing", async () => {
        const result1 = await api.post("/fruits").send({});
        expect(result1.status).toBe(422);
        const result2 = await api.post("/fruits").send({ price: 3 });
        expect(result2.status).toBe(422);
        const result3 = await api.post("/fruits").send({ name: "Abacaxi" });
        expect(result3.status).toBe(422);
    });
});

describe("testing GET /fruits", () => {
    it("shoud return 404 when trying to get a fruit by an id that doesn't exist", async () => {
        console.log(fruits);

        const { status } = await api.get("/fruits/1");
        expect(status).toBe(404);
    });

    it("should return 400 when id param is present but not valid", async () => {
        const { status } = await api.get("/fruits/0");
        expect(status).toBe(400);
        const { status: status2 } = await api.get("/fruits/a");
        expect(status2).toBe(400);
    });

    it("should return one fruit when given a valid and existing id", async () => {
        const fruit = insertFruit("Carambola", 5.30);
        const { status, body } = await api.get(`/fruits/${fruit.id}`);
        expect(status).toBe(200);
        expect(body).toEqual(fruit)
    });

    it("should return all fruits if no id is present", async () => {
        insertFruit("Carambola", 5.30);
        insertFruit("Banana", 5.30);
        const { status, body } = await api.get(`/fruits`);
        expect(status).toBe(200);
        expect(body).toHaveLength(2);
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ])
        )
    });
});
