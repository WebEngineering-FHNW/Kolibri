import { mconcat }       from "../mconcat/mconcat.js";

export { concat }

/**
 * Adds the second iterator to the first iterators end.
 *
 * @template _T_
 * @pure it1 and it2 will be copied defensively
 * @haskell [a] -> [a] -> [a]
 * @type {
 *             (it1: Iterable<_T_>)
 *          => IteratorOperation<_T_>
 *       }
 * @constructor
 * @example
 * const it1 = Range(1);
 * const it2 = Range(2);
 * const concatenated = concat(it1)(it2);
 * console.log(...concatenated);
 * => Logs 0, 1, 0, 1, 2
 */
const concat = it1 => it2 => mconcat([it1, it2]);