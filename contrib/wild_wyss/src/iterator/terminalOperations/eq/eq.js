import { arrayEq } from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";

export { eq$ }

/**
 * Checks the equality of two non-infinite {@link Iterable iterables}.
 *
 * _Note_: Two iterators are considered as equal if they contain or create the exactly same values in the same order.
 * @function
 * @pure it1 and it2 will not be changed
 * @template _T_
 * @type {
 *             (it1: Iterable<_T_>)
 *          => (it2: Iterable<_T_>)
 *          => Boolean
 *       }
 * @example
 * const it1    = Iterator(0, inc, stop);
 * const it2    = Iterator(0, inc, stop);
 * const result = eq$(it1)(it2);
 */
const eq$ = it1 => it2 =>
  arrayEq([...it1])([...it2]);
