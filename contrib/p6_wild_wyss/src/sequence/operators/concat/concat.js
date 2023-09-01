import { mconcat }       from "../mconcat/mconcat.js";

export { concat }

/**
 * Adds the second iterable to the first iterables end.
 *
 * @function
 * @pure
 * @haskell [a] -> [a] -> [a]
 * @template _T_
 * @type {
 *            (it1: Iterable<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2];
 * const range   = Range(2);
 * const concatenated = concat(numbers)(range);
 *
 * console.log(...concatenated);
 * // => Logs '0, 1, 0, 1, 2'
 */
const concat = it1 => it2 => mconcat([it1, it2]);