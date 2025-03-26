import { mconcat } from "../mconcat/mconcat.js";

export { append }
/**
 * Adds the second iterable to the first iterables end.
 *
 * @template _T_
 * @typedef AppendOperationType
 * @function
 * @pure
 * @haskell [a] -> [a] -> [a]
 * @type {
 *            (it1: Iterable<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2];
 * const range   = Range(2);
 * const concatenated = append(numbers)(range);
 *
 * console.log(...concatenated);
 * // => Logs '0, 1, 0, 1, 2'
 */

/**
 * see {@link AppendOperationType}
 * @template _T_
 * @type {AppendOperationType<_T_>}
 */
const append = it1 => it2 => mconcat([it1, it2]);
