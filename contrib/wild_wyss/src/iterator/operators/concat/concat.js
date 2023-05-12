import { mconcat }       from "../mconcat/mconcat.js";
import { ArrayIterator } from "../../constructors/arrayIterator/arrayIterator.js";

export { concat }

/**
 * Adds the second iterator to the first iterators end.
 *
 * @template _T_
 * @pure it1 and it2 will be copied defensively
 * @haskell (++) :: [a] -> [a] -> [a]
 * @type {
 *             (it1: IteratorType<_T_>)
 *          => (it2: IteratorType<_T_>)
 *          => IteratorType<_T_>
 *       }
 * @constructor
 * @example
 * const it1 = Range(1);
 * const it2 = Range(2);
 * const concatenated = concat(it1)(it2);
 * console.log(...concatenated);
 * => Logs: 0, 1, 0, 1, 2
 */
const concat = it1 => it2 => mconcat(ArrayIterator([it1.copy(), it2.copy()]));