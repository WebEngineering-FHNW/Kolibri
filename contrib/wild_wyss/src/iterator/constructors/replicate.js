import { take, repeat } from "../iterator.js";

export { replicate }

/**
 * `replicate n x` creates an {@link IteratorType} of length `n` with `x` the value of every element.
 *
 * @type { <_T_>
 *       (n: Number)
 *    => (value: _T_)
 *    => IteratorType<_T_>
 * }
 * @haskell replicate :: Int -> a -> [a]
 * @example
 * const it = replicate(3)(true);
 * console.log(...it);
 * // => Logs: true, true, true
 */
const replicate = n => value => take(n)(repeat(value));