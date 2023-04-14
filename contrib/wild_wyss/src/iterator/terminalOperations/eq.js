import { arrayEq } from "../../../../../docs/src/kolibri/util/arrayFunctions.js";

export { eq$ }

/**
 * Checks the equality of two non-infinite iterators.
 *
 * _Note_: Two iterators are considered as equal if they contain or create the exactly same values in the same order.
 * @function
 * @pure it1 and it2 will be copied defensively
 * @type {
 *             (it1: IteratorType<*>)
 *          => (it2: IteratorType<*>)
 *          => Boolean
 *       }
 * @example
 * const it1    = Constructors(0, inc, stop);
 * const it2    = Constructors(0, inc, stop);
 * const result = eq$(it1)(it2);
 */
const eq$ = it1 => it2 =>
  arrayEq([...it1.copy()])([...it2.copy()]);
