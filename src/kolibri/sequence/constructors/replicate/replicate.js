import { take }   from "../../operators/take/take.js";
import { repeat } from "../repeat/repeat.js";

export { replicate }

/**
 * `replicate(n)(x)` creates a {@link SequenceType} of length `n` with `x` the value of every element.
 *
 * @constructor
 * @pure
 * @haskell replicate :: Int -> a -> [a]
 * @type { <_T_>
 *           (n: Number)
 *        => (value: _T_)
 *        => Iterable<_T_>
 *       }
 *
 * @example
 * const trues = replicate(3)(true);
 *
 * console.log(...trues);
 * // => Logs 'true, true, true'
 */
const replicate = n => value => take(n)(repeat(value));