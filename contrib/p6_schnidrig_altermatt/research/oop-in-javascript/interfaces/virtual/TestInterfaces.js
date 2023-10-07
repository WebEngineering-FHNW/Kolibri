import { WolfImpl } from "./WolfImpl.js";

/** @type { AnimalVirtual } */
const animal = new WolfImpl("Mario", 42, "male");
animal.eat();
animal.move(35);
animal.talk("Arrooooo");
const wolf = new WolfImpl(42, "male");
wolf.introduce();
wolf.move(20);

// try and instantiate the interface
const virtualAnimal = new AnimalVirtual();
virtualAnimal.eat();