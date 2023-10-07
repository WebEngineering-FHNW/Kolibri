/**
 * An Animal.
 *
 * @interface
 */
const AnimalTopLevel = class {
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
     *
     */
    talk = sound => {
        throw new Error('not implemented');
    };

};