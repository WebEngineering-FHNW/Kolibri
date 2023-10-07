export { HumanImpl }

/**
 * A human.
 * @implements { AnimalTopLevel }
 */
const HumanImpl = class {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    eat = () => {
        console.log("Dining in a fine restaurant");
        return 1;
    };

    move = vehicle => { // the parameter is not declared in the interface but still allowed
        if (vehicle === 'E-Scooter') {
            console.log("Cruising like a dystopian.");
        } else if (vehicle === 'Bike') {
            console.log("Moving eco-friendly");
        } else if (vehicle === 'Car') {
            console.log("You better move with an electric car");
        }
        return { key: 42} // the return value is not declared but still allowed
    };

    talk = sound => console.log("Casual chatting: " + sound);

    introduce = () => console.log("I am " + this.name + " and I am " + this.age + " years old. My gender is " + this.gender);

};


