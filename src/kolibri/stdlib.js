/**
 * @module stdlib
 * Kolibri standard library with functions and data structures that are most commonly used.
 * The stdlib has no dependencies.
 */

export {
    id
}


/**
 * Generic type names for the purpose of expressing the identity of an arbitrarily chosen type. {@see id}.
 * @typedef {*} a
 * @typedef {*} b
 */

/**
 * Identity function, aka "I" in the SKI calculus or "Ibis" (or "Idiot") in the Smullyan bird metaphors.
 * The function in free of side effects and runs in O(1). Function calls can be inlined.
 * @haskell  a -> a
 * @function id
 * @param    {a} x
 * @returns  {a} the parameter x unchanged.
 */
const id = x => x;

