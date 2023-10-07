import { KolibriInterface } from "./KolibriInterface.js";
import { AnimalRestrictive } from "./AnimalRestrictive.js";
import { CatImpl } from "./CatImpl.js";

/** @type { AnimalRestrictive } */
const animal = new CatImpl();
KolibriInterface.ensureImplements(animal, AnimalRestrictive.kolibriInterface());
animal.eat();
animal.move();
animal.talk("Meow");
const cat = new CatImpl();
// cat.introduce();
cat.move();

// try and instantiate the interface
const animalRestrictive = new AnimalRestrictive();