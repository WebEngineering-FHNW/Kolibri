/**
 * @module stdlib
 * Kolibri standard library with functions and data structures that are most commonly used.
 * The stdlib has no dependencies.
 */

export {
    id, c, snd
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
 * @example
 * id(1) === 1
 */
const id = x => x;

/**
 * Constant function that captures and caches the argument and makes it available like a "getter".
 * Aka "konst", "fst" (the first of two curried parameters),
 * "K" in the SKI calculus, or "Kestrel" in the Smullyan bird metaphors.
 * @haskell  a -> b -> a
 * @function c
 * @param    {a} x
 * @returns  { function(*): {a} } a function that ignores its argument and returns the parameter x unchanged.
 * @example
 * c(1)(undefined) === 1;
 * const getExpr = c(expr);
 * // expression might change here
 * getExpr() === expr;
 */
const c = x => _ => x;

/**
 * A Function that returns the second of two curried arguments.
 * "KI" in the SKI calculus, or "Kite" in the Smullyan bird metaphors.
 * It can be seen as a cached getter for the id function: {@link c}({@link id})
 * @haskell  b -> a -> a
 * @function snd
 * @param    {*} _ - the parameter is ignored
 * @returns  { function(y:{a}): {a} } a function that returns its argument {@link a}
 * @example
 * snd(undefined)(1) === 1
 */
const snd = _ => y => y;
