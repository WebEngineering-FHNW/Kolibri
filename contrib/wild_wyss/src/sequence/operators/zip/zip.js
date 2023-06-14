import { Pair }    from "../../../../../../docs/src/kolibri/stdlib.js";
import { zipWith } from "../../sequence.js";

export { zip }

/**
 * Zip takes two {@link Iterable iterables} and returns an {@link Iterable iterable} of corresponding {@link PairType paris}
 * @function
 * @pure both iterators will be copied defensively
 * @template _T_
 * @template _U_
 * @type {
 *             (it1: Iterable<_T_>)
 *          => (it2: Iterable<_U_>)
 *          => SequenceType<PairType<_T_, _U_>>
 * }
 *
 * @example
 * const it1 = [0, 1, 2],
 * const it2 = [3, 4, 5],
 * const zipped = zip(it1)(it2);
 *
 * console.log([...zipped].map(snd));
 * // => Logs 2, 3, 4
 */
const zip = it1 => it2 => zipWith((i,j) => Pair(i)(j))(it1)(it2);
