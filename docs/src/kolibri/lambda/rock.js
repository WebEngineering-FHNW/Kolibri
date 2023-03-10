// rock-solid data structures

// this is built without using objects, without local variables, all purely immutable

export { Pair, fst, snd, Tuple, Choice }


// ----------- Data structures

const Pair =
    first  =>
    second =>
    Object.seal( selector  => selector (first) (second) ); // seal to disallow using functions as objects

const fst = arg_1 => arg_2 => arg_1;
const snd = arg_1 => arg_2 => arg_2;

const Tuple = n => {
    if (n < 1) throw new Error("Tuple must have first argument n > 0");

    return [
        TupleCtor (n) ([]), // ctor curries all values and then waits for the selector
        // every selector is a function that picks the value from the curried ctor at the same position
        ...Array.from( {length:n}, (it, idx) => values => values[idx] )
    ];
};

const nApply = n => f => n === 0 ? f : ( g => nApply (n-1) (f (g) ));  // a curried functions that eats so many arguments

const Choice = n => { // number of ctors
    if (n < 1) throw new Error("Choice must have first argument n > 0");

    return [
        ...Array.from( {length:n}, (it, idx) => ChoiceCtor (idx + 1) (n + 1) ([]) ), // first arg is the ctor state
        choice => nApply (n) (choice)                                                // takes n + 1 args and returns arg[0] (arg[1]) (arg[2]) ... (arg[n])

    ];
};

// private implementation details ---------------------

const TupleCtor = n => values => {
    if (n === 0 ) {                                             // we have curried all ctor args, now
        return Object.seal(selector => selector(values))        // return a function that waits for the selector
    }
    return value => {                                           // there are still values to be curried
        return TupleCtor (n - 1) ([...values, value])           // return the ctor for the remaining args
    }
};

const ChoiceCtor = position => n => choices => {
    if (n === 0 ) {                                                  // we have curried all ctor args, now
        return Object.seal(choices[position] (choices[0]) )          // we call the chosen function with the ctor argument
    }
    return choice => {                                                // there are still choices to be curried
        return ChoiceCtor (position) (n - 1) ([...choices, choice])   // return the ctor for the remaining args
    }
};

