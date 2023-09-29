import app from "../src/app";
import supertest from "supertest";
import { createFruitInputObject, insertFruit } from "./factories/fruit.factory";

const api = supertest(app);

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