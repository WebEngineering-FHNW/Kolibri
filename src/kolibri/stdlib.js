/**
 * @module stdlib
 * Kolibri standard library with functions and data structures that are most commonly used.
 * The stdlib has no dependencies.
 */

export {
    id, c
}

/**
 * Generic type names for the purpose of expressing the identity of an arbitrarily chosen type. See {@link id}.
 * @typedef {*} a
 * @typedef {*} b
 */

/**
 * Identity function, aka "I" in the SKI calculus or "Ibis" (or "Idiot") in the Smullyan bird metaphors.
 * The function is pure and runs in O(1). Function calls can be inlined.
 * @haskell  a -> a
 * @function id
 * @param    {a} x
 * @returns  {a} the parameter x unchanged.
 * @example  id(1) === 1
 */
const id = x => x;

/**
 * Constant function that captures and caches the argument.
 * Aka "konst", "fst" (the first of two curried parameters),
 * "K" in the SKI calculus, or "Kestrel" in the Smullyan bird metaphors.
 * @haskell  a -> b -> a
 * @function f
 * @param    {a} x
 * @returns  { function(*): {a} } a function that ignores its argument and returns the parameter x unchanged.
 * @example
 * c(1)(undefined) === 1;
 * const getExpr = c(expr);
 * // expression changes
 * getExpr() === expr;
 */
const c = x => _ => x;
