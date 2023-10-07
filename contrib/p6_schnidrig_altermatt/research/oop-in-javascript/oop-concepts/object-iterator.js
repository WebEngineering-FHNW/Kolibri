const cat =  {
    name: 'Timmy',
    age: 10,
    eat: () => { console.log('I am eating') },
    move: (speed, x, y) => { console.log('I am moving with ' + speed + 'in direction x: ' + x + ' y: ' + y) },
    talk: sound => { console.log('I am talking: ' + sound) }
};

for (const property in cat) {
    console.log(`${property}: ${cat[property]}`);
}

class Dog {
    eat() { console.log('I am eating') };
    move(speed, x, y) { console.log('I am moving with ' + speed + 'in direction x: ' + x + ' y: ' + y) };
    talk(sound) { console.log('I am talking: ' + sound) };
}

Object.getOwnPropertyNames(Dog.prototype).forEach(value => {
    console.log(value);
});


