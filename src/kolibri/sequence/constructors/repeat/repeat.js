import { Sequence} from "../sequence/Sequence.js";
import { forever } from "../../util/helpers.js";

export { repeat }

/**
 * Returns a {@link SequenceType} that will repeatedly yield the value of `arg` when iterated over.
 * `repeat` will never be exhausted.
 *
 * @constructor
 * @pure
 * @haskell repeat :: a -> [a]
 * @template _T_
 * @param   { _T_ } arg
 * @returns { SequenceType<_T_> }
 *
 * @example
 * const ones   = repeat(1);
 * const result = take(3)(ones);
 *
 * console.log(...result);
 * // => Logs '1, 1, 1'
 */
const repeat = arg => Sequence(arg, forever, _ => arg);
