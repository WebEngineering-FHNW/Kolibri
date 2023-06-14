import { arrayEq } from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";

export { eq$ }

/**
 * Checks the equality of two non-infinite {@link Iterable iterables}.
 *
 * _Note_: Two iterables are considered as equal if they contain or create the exactly same values in the same order.
 * @see Use ["=="] defined on the {@link SequencePrototype} to perform a comparison in a more readable form.
 *
 * @function
 * @pure
 * @haskell (==) :: Eq a => a -> a -> Bool
 * @template _T_
 * @type {
 *             (it1: Iterable<_T_>)
 *          => (it2: Iterable<_T_>)
 *          => Boolean
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3];
 * const range   = Range(3);
 * const result  = eq$(numbers)(range);
 *
 * console.log(result);
 * // => Logs 'true'
 */
const eq$ = it1 => it2 => arrayEq([...it1])([...it2]);