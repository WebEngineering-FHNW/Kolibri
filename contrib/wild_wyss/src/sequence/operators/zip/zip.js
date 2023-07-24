import { Pair }    from "../../../stdlib/pair.js";
import { zipWith } from "../zipWith/zipWith.js";

export { zip }

/**
 * Zip takes two {@link Iterable iterables} and returns an {@link Iterable iterable} of corresponding {@link PairType paris}.
 *
* @function
 * @pure
 * @haskell [a] -> [b] -> [(a, b)]
 * @template _T_, _U_
 * @type {
 *             (it1: Iterable<_T_>)
 *          => (it2: Iterable<_U_>)
 *          => SequenceType<PairType<_T_, _U_>>
 * }
 *
 * @example
 * const numbers = [0, 1, 2],
 * const range   = Range(3, 5);
 * const zipped  = zip(numbers)(range);
 *
 * forEach$(x => console.log(...x))(zipped);
 * // => Logs '0 3, 1 4, 2 5'
 */
const zip = it1 => it2 => zipWith((i,j) => Pair(i)(j))(it1)(it2);
