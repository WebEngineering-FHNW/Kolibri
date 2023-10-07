import { Animal } from "./IAnimal.js";
import { Monkey } from "./MonkeyImpl.js";

const monkey = Animal(Monkey());
monkey.eat();
monkey.move();
monkey.talk('uga uga');
monkey.die();