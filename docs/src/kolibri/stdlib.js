/**
 * @module stdlib
 * Kolibri standard library with functions and data structures that are most commonly used.
 * The stdlib has no dependencies.
 */

export {
    id, c, snd,
    Tuple, Choice,
    Pair, fst,
    Left, Right, Nothing, Just
}

/**
 * Identity function, aka "I" in the SKI calculus or "Ibis" (or "Idiot") in the Smullyan bird metaphors.
 * The function is pure and runs in O(1). Function calls can be inlined.
 * @template a
 * @haskell  a -> a
 * @pure
 * @param    {a} x
 * @returns  {a} the parameter x unchanged.
 * @example
 * id(1) === 1
 */
const id = x => x;

/**
 * Constant function that captures and caches the argument and makes it available like a "getter".
 * Aka "konst", "fst" (the first of two curried parameters),
 * "K" in the SKI calculus, or "Kestrel" in the Smullyan bird metaphors.
 * @template a
 * @template b
 * @haskell  a -> b -> a
 * @pure
 * @type     { (x:a) => (...b) => a}
 * @example
 * c(1)(undefined) === 1;
 * const getExpr = c(expr);
 * // expression might change here
 * getExpr() === expr;
 */
const c = x => () => x;

/**
 * A Function that returns the second of two curried arguments.
 * "KI" in the SKI calculus, or "Kite" in the Smullyan bird metaphors.
 * It can be seen as a cached getter for the id function: {@link c}({@link id})
 * @template a
 * @template b
 * @haskell  b -> a -> a
 * @pure
 * @type     { (_:?b) => (y:a) => a}
 * @example
 * snd(undefined)(1) === 1;
 */
const snd = (_=undefined) => y => y;

// --------- ADT section ---------

// private ADT implementation details ---------------------

/** @private */
const TupleCtor = n => values =>
    n === 0                                            // we have curried all ctor args, now
        ? Object.seal(selector => selector(values))    // return a function that waits for the selector
        : value =>                                     // there are still values to be curried
          TupleCtor (n - 1) ([...values, value]);      // return the ctor for the remaining args

/** @private */
const ChoiceCtor = position => n => choices =>
    n === 0                                                      // we have curried all ctor args, now
        ? Object.seal(choices[position] (choices[0]) )           // we call the chosen function with the ctor argument
        : choice =>                                              // there are still choices to be curried
          ChoiceCtor (position) (n - 1) ([...choices, choice]);  // return the ctor for the remaining args

// end of private section, publicly exported constructors follow

/**
 * An n-Tuple stores n different values, which can be retrieved by accessor functions.
 * It is the most general form of a Product Type. Tuples are immutable. Values are accessed in O(1).
 * Since no indexes are managed by the user, there are no out-of-bounds errors.
 * @pure
 * @param  {!number} n - the cardinality, i.e. Tuple(n) can store n values. Mandatory. Must be > 0 or an error is thrown.
 * @return {Array<function>} - an array where the first item is a constructor, follow by n accessor functions
 * @constructor
 * @example
 * const [Triple, one, two, three] = Tuple(3);
 * const triple = Triple(1)(2)(3);
 * triple(two) === 2;
 */
const Tuple = n => {
    if (n < 1) throw new Error("Tuple must have first argument n > 0");
    return [
        TupleCtor (n) ([]), // ctor curries all values and then waits for the selector
        // every selector is a function that picks the value from the curried ctor at the same position
        ...Array.from( {length:n}, (it, idx) => values => values[idx] )
    ];
};

/**
 * A Choice selects between n distinct values, each of which can only be accessed if a
 * handling function is provided for each possible value. One cannot forget to handle edge cases.
 * It is the most general form of a CoProduct aka Sum Type. Choices are immutable.
 * @pure
 * @param {!number} n - the cardinality, i.e. number of possible choices. Mandatory. Must be > 0 or an error is thrown.
 * @return {Array<function>} - an array of n choice constructors
 * @constructor
 * @example
 * const [Bad, Good, Unknown] = Choice(3);
 * const guessWhat = Good(1);
 * guessWhat
 *      (_ => console.error("this is bad")) // handle Bad case
 *      (x => x)                            // handle Good case
 *      (_ => 0);                           // Unknown -> default value
 */
const Choice = n => { // number of constructors
    if (n < 1) throw new Error("Choice must have first argument n > 0");
    return Array.from( {length:n}, (it, idx) => ChoiceCtor (idx + 1) (n + 1) ([]) ) ; // n constructors with n curried args
};

/**
 * A function that selects between two arguments that are given in curried style.
 * Only needed internally for the sake of proper JsDoc.
 * @template a
 * @template b
 * @callback pairSelector
 * @pure
 * @type     { (x:a) => (y:b) => (a|b)}
 */
/**
 * A Pair is a {@link Tuple}(2) with a smaller and specialized implementation.
 * Access functions are {@link fst} and {@link snd}. Pairs are immutable.
 * "V" in the SKI calculus, or "Vireo" in the Smullyan bird metaphors.
 * @template a
 * @template b
 * @haskell a -> b -> (a -> b -> a|b) -> a|b
 * @pure    if the selector function is pure, which is usually is
 * @type    { (x:a) => (y:b) => (s:pairSelector) => (a|b) }
 * @constructor
 * @example
 * const dierk = Pair("Dierk")("König");
 * dierk(fst) === "Dierk");
 * dierk(snd) === "König");
 */
const Pair = x => y => selector => selector(x)(y);

/**
 * Select the first of two curried arguments for the use with {@link Pair}s.
 * An alternative name for {@link c}:
 * @template a
 * @template b
 * @haskell  a -> b -> a
 * @pure
 * @type     { (x:a) => (y:b) => a}
 * @example
 * fst(1)(undefined) === 1;
 */
const fst = c;

/*
 * The Either types.
 * @haskell Either a b
 */

/**
 * A general function from whatever "a" to whatever "b".
 * Only needed internally for the sake of proper JsDoc.
 * @template a
 * @template b
 * @typedef  functionAtoB<a,b>
 * @pure     supposed to be pure
 * @type     { (x:a) => b }
 */
/**
 * The Left constructor of an Either type. An "Either" is either {@link Left} or {@link Right}.
 * It is constructed with a value of type {@link a} and waits for two more functions f and g
 * as curried arguments.
 * When both are given, f(x) is called.
 * The Left case of an Either type is usually (but not necessarily so) an error case.
 * Left values are immutable.
 * @template a
 * @template b
 * @haskell a -> (a -> b) -> c -> b
 * @pure    if functionAtoB is pure
 * @type    { (x:a) =>  (f:functionAtoB<a,b>)  => (y:*) => b }
 * @example
 * const withFoo = (null == foo) ? Left("could not find foo") : Right(foo);
 * withFoo
 *      (msg => console.error(msg))      // handle left case
 *      (x   => doSomethingWithFoo(x));  // handle right case
 */

const Left  = x => f => _ => f(x);

/**
 * The Right constructor of an Either type. An "Either" is either {@link Left} or {@link Right}.
 * It is constructed with a value of type {@link b} and waits for two more functions f and g
 * as curried arguments.
 * When both are given, g(x) is called.
 * The Right case of an Either type is usually (but not necessarily so) the good case.
 * Right values are immutable.
 * @template a
 * @template b
 * @haskell a -> c -> (a -> b) -> b
 * @pure    if functionAtoB is pure
 * @type    { (x:a) => (y:*) => (f:functionAtoB<a,b>) => b }
 * @example
 * const withFoo = (null == foo) ? Left("could not find foo") : Right(foo);
 * withFoo
 *      (msg => console.error(msg))
 *      (x   => doSomethingWithFoo(x));
 */
const Right = x => _ => g => g(x);

/**
 * Nothing is the error case of the Maybe type. A "Maybe a" can be either Nothing or "{@link Just} a".
 * Nothing is immutable. Nothing is a singleton.
 * Nothing is used to get around missing null/undefined checks.
 * @template a
 * @template b
 * @haskell Nothing :: Maybe a
 * @pure
 * @type    { (f:functionAtoB<a,b>)  => (y:*) => b }
 * @example
 * const mayFoo = (null == foo) ? Nothing : Just(foo);
 * mayFoo
 *      (_   => console.error("cannot find foo"))
 *      (x   => doSomethingWithFoo(x));
 */
const Nothing = Left (undefined);

/**
 * Just is the success case of the Maybe type. A "Maybe a" can be either {@link Nothing} or "Just a".
 * Just values are immutable.
 * Just is used to get around missing null/undefined checks.
 * @template a
 * @template b
 * @haskell Just a :: Maybe a
 * @pure
 * @type    { (x:a) => (y:*) => (f:functionAtoB<a,b>) => b }
 * @example
 * const mayFoo = (null == foo) ? Nothing : Just(foo);
 * mayFoo
 *      (_   => console.error("cannot find foo"))
 *      (x   => doSomethingWithFoo(x));
 */
const Just = Right;

// ----------- End of ADT section -----------

// to do
// Eq typeclass, symmetry, reflexivity
// booleanEq, pairEq, tupleEq, eitherEq, choiceEq, maybeEq, arrayEq

// functor typeclass, associativity (if pure), left and right identity
// pairMap, tupleMap, eitherMap (only Right), choiceMap (n functions), maybeMap

// Num? Ord? Monoid? Monad?
