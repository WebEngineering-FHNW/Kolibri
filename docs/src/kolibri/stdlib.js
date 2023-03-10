/**
 * @module stdlib
 * Kolibri standard library with functions and data structures that are most commonly used.
 * The stdlib has no dependencies.
 * It only delegates to other modules where the actual implementation is implemented and tested.
 */

export {
    id, c,
    Tuple, Choice,
    Pair, fst, snd,
    Left, Right, Nothing, Just
} from "./lambda/church.js";


// to do
// Eq typeclass, symmetry, reflexivity
// booleanEq, pairEq, tupleEq, eitherEq, choiceEq, maybeEq, arrayEq

// functor typeclass, associativity (if pure), left and right identity
// pairMap, tupleMap, eitherMap (only Right), choiceMap (n functions), maybeMap

// Num? Ord? Monoid? Monad?
