import { KolibriInterface } from "./KolibriInterface.js";

export { AnimalRestrictive }

/**
 * @interface
 */
const AnimalRestrictive = class {
    static kolibriInterface = () => new KolibriInterface('Animal', ['eat', 'move', 'talk']);
    /**
     * Let the animal eat.
     *
     * @return { Number } hungerLevel
     */
    eat = () => {
        throw new Error('not implemented');
    };

    /**
     * Move the Animal.
     *
     * @return { void }
     */
    move = () => {
        throw new Error('not implemented');
    };

    /**
     * Let the Animal talk.
     *
     * @param { String } sound
     * @return { void }
     *
     */
    talk = sound => {
        throw new Error('not implemented');
    };
};
