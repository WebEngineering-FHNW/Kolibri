export { CatImpl }

/**
 * @implements { AnimalRestrictive }
 */
const CatImpl = class {
    eat  = () => {
        console.log("Eating a mouse.");
        return 1;
    };

    move = () => {
        console.log("Running across the street.")
    };

    talk = sound => console.log("The cat says: " + sound);
};