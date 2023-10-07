export { WolfImpl }

/**
 * A wolf.
 * @constructor
 * @implements { AnimalVirtual }
 */
const WolfImpl = class {
    constructor(age, sex) {
        this.age = age;
        this.sex = sex;
    }

    eat = () => {
        console.log("Eating raw meat");
        return 1;
    };

    move = speed => { // the parameter is not declared in the interface but still allowed
        console.log("Sneaking through the forest at this speed: " + speed);
        return { key: 42 } // the return value is not declared but still allowed
    }

    talk = sound  => console.log("Howling across the mountains: " + sound);

    introduce = () => console.log("This wolf is " + this.age + " years old. It is " + this.sex);
};
