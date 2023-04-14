import { Pair }    from "../../../../../docs/src/kolibri/stdlib.js";
import { zipWith } from "../iterator.js";

export { zip }

/**
 * Zip takes two {@link IteratorType Iterators} and returns a {@link IteratorType iterator} of corresponding pairs.
 * @function
 * @pure both iterators will be copied defensively
 * @template _T_
 * @template _U_
 * @type {
 *             (it1: IteratorType<_T_>)
 *          => (it2: IteratorType<_U_>)
 *          => IteratorType<PairType<_T_, _U_>>
 * }
 * @example
 * const it1 = Range(2);
 * const it2 = Range(2, 4);
 * const zipped = zip(it1)(it2);
 * console.log([...zipped].map(snd));
 * // prints: 2, 3, 4
 */
const zip = it1 => it2 => zipWith((i,j) => Pair(i)(j))(it1)(it2);
