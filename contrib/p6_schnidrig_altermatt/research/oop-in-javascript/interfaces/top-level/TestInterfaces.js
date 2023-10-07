import { HumanImpl } from "./HumanImpl.js";

/** @type { AnimalTopLevel } */
const animal = new HumanImpl("Mario", 42, "male");
animal.eat();
animal.move("Car");
animal.talk("Bla bla");
const human = new HumanImpl("Luigi", 42, "male");
human.introduce();
human.move("Bike");

// try and instantiate the interface
const animalTopLevel = new AnimalTopLevel();