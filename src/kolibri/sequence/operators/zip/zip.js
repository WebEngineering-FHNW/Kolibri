import { Pair }    from "../../../lambda/pair.js";
import { zipWith } from "../zipWith/zipWith.js";

export { zip }

/**
 * Zip takes two {@link Iterable}s and returns an {@link Iterable} of corresponding {@link PairType pairs}.
 * @typedef ZipOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell [a] -> [b] -> [(a, b)]
 * @type { <_U_>
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
 * tap(x => console.log(...x))(zipped);
 * // => Logs '0 3, 1 4, 2 5'
 */

/**
 * see {@link ZipOperationType}
 * @template _T_
 * @type { ZipOperationType<_T_> }
 */
const zip = it1 => it2 => zipWith((i,j) => Pair(i)(j))(it1)(it2);
