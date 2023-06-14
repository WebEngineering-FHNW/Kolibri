import { Sequence } from "../../sequence.js";

export { repeat }

/**
 * Returns a {@link SequenceType} that will repeatedly yield the value of `arg` when iterated over.
 * `repeat` will never be exhausted.
 *
 * @constructor
 * @pure
 * @haskell a -> [a]
 * @template _T_
 * @param { _T_ } arg
 * @return { SequenceType<_T_> }
 *
 * @example
 * const ones   = repeat(1);
 * const result = take(3)(ones);
 *
 * console.log(...result);
 * // => Logs '1, 1, 1'
 */
const repeat = arg => Sequence(arg, _ => false, _ => arg);