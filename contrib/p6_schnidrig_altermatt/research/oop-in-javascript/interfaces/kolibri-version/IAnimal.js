export { Animal }

/**
 * IAnimal is an interface.
 *
 * @typedef IAnimal<T>
 * @template T
 * @property { () => Number } eat - Let the animal eat.
 * @property { () => void } move - Let the animal move.
 * @property { (sound:String) => void } talk - Let the animal talk.
 *
 */

/**
 * Constructor for an IAnimal<T>.
 * @template T
 * @param { T } animalSubtype - an animal subtype that implements the animal interface
 * @returns  IAnimal<T>
 * @constructor
 * @example
 * const animal = Animal();
 * const hungerLevel = animal.eat();
 * animal.move();
 * animal.talk("");
 */
const Animal = animalSubtype => ({
    eat: () => animalSubtype.eat(),
    move: () => animalSubtype.move(),
    talk: sound => animalSubtype.talk(sound)
});

