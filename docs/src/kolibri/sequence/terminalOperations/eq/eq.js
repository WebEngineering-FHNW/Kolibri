import { arrayEq } from "../../../util/arrayFunctions.js";

export { eq$ }

/**
 * Checks the equality of two non-infinite {@link Iterable iterables}.
 *
 * _Note_: Two iterables are considered as equal if they contain or create the exactly same values in the same order.
 * @see Use ["=="] defined on the {@link SequencePrototype} to perform a comparison in a more readable form.
 * @typedef EqualOperationType
 * @function
 * @pure
 * @template _T_
 * @type {
 *          (it2: Iterable<_T_>)
 *          => Boolean
 *       }
 * @attention This function only works if at least one iterable is finite as indicated by the name ending with '$'.
 *
 * @example
 * const numbers = [0, 1, 2, 3];
 * const range   = Range(3);
 * const result  = eq$(numbers)(range);
 *
 * console.log(result);
 * // => Logs 'true'
 */

/**
 * see {@link EqualOperationType}
 * @haskell (==) :: Eq a => a -> a -> Bool
 * @template _T_
 * @param { Iterable<_T_> } it1
 * @returns { EqualOperationType<_T_> }
 */

const eq$ = it1 => it2 => arrayEq([...it1])([...it2]);
