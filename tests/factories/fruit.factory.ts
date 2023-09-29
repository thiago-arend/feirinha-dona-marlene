import { FruitInput } from '@/services/fruits-service';
import { Fruit } from '@/repositories/fruits-repository';
import fruits from '../../src/data/fruits'

export function createFruitInputObject(name: string, price: number): FruitInput {
    const fruit: FruitInput = {
        name,
        price
    }
    return fruit;
}

export function insertFruit(name: string, price: number): void {
    const fruit: Fruit = {
        id: fruits.length + 1,
        name,
        price
    }
    fruits.push(fruit);
}